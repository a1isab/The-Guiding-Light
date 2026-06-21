import withNextIntl from "next-intl/plugin";
import type { NextConfig } from "next";

const nextIntl = withNextIntl("./i18n/request.ts");

const nextConfig: NextConfig = {};

export default nextIntl(nextConfig);
