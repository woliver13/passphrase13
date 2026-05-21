import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">passphrase13</h1>
      <p className="text-muted-foreground">Passphrase generator — coming soon.</p>
      <Button>Generate passphrase</Button>
    </main>
  );
}
