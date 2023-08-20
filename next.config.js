/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true
    },
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
