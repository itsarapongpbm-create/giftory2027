import { PrismaClient } from '@prisma/client';
import net from 'net';

const globalForPrisma = globalThis as unknown as {
  rawPrisma?: PrismaClient;
  prisma?: PrismaClient;
  dbReachable?: boolean;
  lastDbCheck?: number;
};

const rawPrisma = globalForPrisma.rawPrisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.rawPrisma = rawPrisma;
}

function getDbHostPort(): { host: string; port: number } | null {
  try {
    const url = process.env.DATABASE_URL;
    if (!url) return null;
    const parsed = new URL(url);
    return {
      host: parsed.hostname || '127.0.0.1',
      port: Number(parsed.port) || 5432,
    };
  } catch {
    return { host: '127.0.0.1', port: 5432 };
  }
}

async function isDatabaseReachable(): Promise<boolean> {
  const now = Date.now();
  // Fast cache: 10s if down, 30s if up
  const cacheTtl = globalForPrisma.dbReachable ? 30_000 : 10_000;
  if (
    globalForPrisma.lastDbCheck &&
    now - globalForPrisma.lastDbCheck < cacheTtl &&
    globalForPrisma.dbReachable !== undefined
  ) {
    return globalForPrisma.dbReachable;
  }

  const endpoint = getDbHostPort();
  if (!endpoint) return true;

  const reachable = await new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(250);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(endpoint.port, endpoint.host);
  });

  globalForPrisma.dbReachable = reachable;
  globalForPrisma.lastDbCheck = now;
  return reachable;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createPrismaProxy(target: any): any {
  return new Proxy(target, {
    get(obj, prop) {
      const orig = obj[prop];
      if (typeof orig === 'object' && orig !== null) {
        return createPrismaProxy(orig);
      }
      if (typeof orig === 'function') {
        return async (...args: unknown[]) => {
          const ok = await isDatabaseReachable();
          if (!ok) {
            throw new Error('Database is offline or unreachable');
          }
          try {
            return await orig.apply(obj, args);
          } catch (error) {
            globalForPrisma.dbReachable = false;
            globalForPrisma.lastDbCheck = Date.now();
            throw error;
          }
        };
      }
      return orig;
    },
  });
}

export const prisma = (globalForPrisma.prisma ??
  createPrismaProxy(rawPrisma)) as PrismaClient;

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
