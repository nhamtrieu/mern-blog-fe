import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
    return (
        <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center gap-2">
            <div className="flex flex-1 justify-center flex-col">
                <h2 className="text-2xl">Want to learn more?</h2>
                <p className="text-gray-500 ">
                    Checkout these resources with React
                </p>
                <Link
                    to={"https://google.com"}
                    target="_blank"
                    className="w-full"
                >
                    <Button
                        gradientDuoTone={"purpleToPink"}
                        className="rounded-xl w-full"
                    >
                        Learn More
                    </Button>
                </Link>
            </div>
            <div className="w-1/2">
                <img
                    src="https://res.cloudinary.com/practicaldev/image/fetch/s--ffm9Lfjx--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/sc4ung0l605tn9oux9ee.png"
                    alt=""
                />
            </div>
        </div>
    );
}
