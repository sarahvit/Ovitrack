export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh bg-ovitrack bg-ovitrack-noise">
            {children}
        </div>
    );
}