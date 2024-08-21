/** @type {import('next').NextConfig} */
const nextConfig = {
	async redirects() {
		return [
			{
				source: "/:id*/raw",
				destination: "/api/paste/:id*/raw",
				permanent: true
			},
			{
				source: "/",
				destination: "/api/cli",
				has: [
					{
						type: "header",
						key: "content-type",
						value: "multipart/form-data*"
					}
				],
				permanent: false
			}
		]
	}
}

module.exports = nextConfig
