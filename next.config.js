/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || []

			const treeSitterPackages = [
				"tree-sitter",
				"tree-sitter-go",
				"tree-sitter-python",
				"tree-sitter-typescript",
				"tree-sitter-rust"
			]

			for (const pkg of treeSitterPackages) {
				config.externals.push(pkg)
			}
		}
		return config
	},

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
