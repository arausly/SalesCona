/** @type {import('next').NextConfig} */
/**
 *  experimental: {
        appDir: true
    },
 */
const nextConfig = {
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "zuhxclkftgwtzzxwmqnq.supabase.co",
                port: "",
                pathname: "/**"
            }
        ]
    }
};

module.exports = nextConfig;
