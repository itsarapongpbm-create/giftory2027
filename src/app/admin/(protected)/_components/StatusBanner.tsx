type StatusBannerProps = {
  saved?: boolean;
  savedMessage?: string;
  errorMessage?: string;
};

export default function StatusBanner({
  saved,
  savedMessage = 'Saved changes successfully.',
  errorMessage,
}: StatusBannerProps) {
  if (!saved && !errorMessage) {
    return null;
  }

  return (
    <div className="mt-6 grid gap-3">
      {saved && (
        <div
          role="status"
          className="border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-sm font-light text-emerald-900"
        >
          {savedMessage}
        </div>
      )}
      {errorMessage && (
        <div
          role="alert"
          className="border border-main-red/40 bg-main-red/5 px-4 py-3 text-sm font-light text-maroon"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
}
