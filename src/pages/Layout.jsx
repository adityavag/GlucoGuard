import { Clock, Eye, ShieldCheck } from "lucide-react";
import Card from "../components/Card";
import { title } from "framer-motion/client";
import Landing from "./Landing";
const Layout = () => {
    return (
        <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
            <Landing/>
            <div className="grid md:grid-cols-3 md:gap-2 p-4">
                <Card
                    icon=<Eye />
                    title="Advanced Screening"
                    content="State-of-the-art image analysis for accurate diagnosis of diabetic retinopathy."
                />
                <Card
                    icon=<ShieldCheck />
                    title="Secure & Confidential"
                    content="Top-tier security measures to protect patient data and ensure privacy."
                />
                <Card
                    icon=<Clock />
                    title="Efficient Workflow"
                    content="Streamlined process for quick and easy screenings, saving you valuable time."
                />
            </div>
        </div>
    )
}

export default Layout;