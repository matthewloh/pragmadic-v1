/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatar.vercel.sh",
            },
            {
                protocol: "https",
                hostname: "iwoygssdyztqrbbbyygp.supabase.co",
            },
        ],
    },
}

export default nextConfig
