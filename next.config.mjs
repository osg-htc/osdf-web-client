
import bundleAnalyzer from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Configure `pageExtensions` to include markdown and MDX files
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	basePath: process.env.NEXT_PUBLIC_BASE_PATH,
	output: "export",
	trailingSlash: true,
  experimental: {
    sri: {
      algorithm: 'sha256', // or 'sha384' or 'sha512'
    },
  },
};

const withBundleAnalyzer = bundleAnalyzer({
	enabled: process.env.ANALYZE === 'true',
})



export default withBundleAnalyzer(nextConfig);
