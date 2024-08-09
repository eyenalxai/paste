"use client"

type ErrorPageProps = {
	error: Error
}

export default function ErrorPage({ error }: ErrorPageProps) {
	return (
		<div className="flex flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-md text-center">
				<div className="mx-auto size-12 text-primary" />
				<h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Error</h1>
				<p className="mt-4 text-foreground">Something went wrong! Please try again later.</p>
				<p className="mt-2 text-muted-foreground">{error.message}</p>
			</div>
		</div>
	)
}
