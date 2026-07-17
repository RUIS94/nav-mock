export function PageStub({ title, description }: { title: string; description?: string }) {
  return (
    <div className="p-8">
      <div className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Page
      </div>
      <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
      {description && (
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      )}
      <div className="mt-8 flex h-72 items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground">
        Content for "{title}" goes here
      </div>
    </div>
  );
}
