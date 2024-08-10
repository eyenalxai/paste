/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/",
					destination: "/api/cli",
					has: [
						{
							type: "header",
							key: "content-type",
							value: "multipart/form-data.*"
						}
					]
				}
			]
		}
	}
}

module.exports = nextConfig
