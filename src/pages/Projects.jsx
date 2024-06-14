import CallToAction from "../components/CallToAction";

export default function Projects() {
    return (
        <div className=" min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3">
            <h1 className=" text-3xl font-semibold">Project</h1>
            <p className=" text-sm text-gray-500">
                Build and fun engaging while learning skill of web developer
            </p>
            <CallToAction />
        </div>
    );
}
