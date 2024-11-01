/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cloud.appwrite.io',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
            }
        ]
    },
    typescript: {
        ignoreBuildErrors: true,
    }
};

export default nextConfig;
