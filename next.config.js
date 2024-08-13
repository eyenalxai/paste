/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || []

			const treeSitterPackages = [
				"tree-sitter",
				"tree-sitter-bash",
				"tree-sitter-go",
				"tree-sitter-python",
				"tree-sitter-rust",
				"@tree-sitter-grammars/tree-sitter-toml",
				"tree-sitter-typescript"
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
					source: "/:uuid*/raw",
					destination: "/api/paste/:uuid*/raw"
				},
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
