import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    // server: {
    //     proxy: {
    //         "/api": {
    //             target: "http://3.0.109.252",
    //             secure: false,
    //         },
    //     },
    // },
    plugins: [react()],
});
