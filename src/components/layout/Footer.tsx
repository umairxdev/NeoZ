export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for modern news aggregation. Feeds updated every 10 minutes.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">About</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
