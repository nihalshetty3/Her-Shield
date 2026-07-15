import { useEffect, useState, useRef } from "react";

export default function IncidentDashboard() {
    const [data, setData] = useState(null);

    async function loadDashboard() {
        const res = await fetch("http://localhost:8000/dashboard");
        const json = await res.json();
        setData(json);
    }
    useEffect(() => {
        loadDashboard();

        const timer = setInterval(loadDashboard, 2000);
        return () => clearInterval(timer);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }
    return (

        <div className="bg-zinc-900 rounded-2xl p-8">

            <h1 className="text-3xl font-bold mb-8">

                ACTIVE INCIDENT

            </h1>

            <div className="grid grid-cols-2 gap-5">

                <Card
                    title="Status"
                    value={data.status}
                />

                <Card
                    title="Risk"
                    value={data.risk}
                />

                <Card
                    title="Incident"
                    value={data.incidentType}
                />

                <Card
                    title="SOS"
                    value={
                        data.triggerSOS
                            ? "Triggered"
                            : "Not Triggered"
                    }
                />

            </div>

            <div className="mt-8">

                <h2 className="text-xl font-bold">

                    AI Summary

                </h2>

                <p>{data.summary}</p>

            </div>

            <div className="mt-8">

                <h2 className="text-xl font-bold">

                    Recommended Action

                </h2>

                <p>{data.recommendedAction}</p>

            </div>

            <div className="mt-10">

                <h2 className="text-xl font-bold mb-4">
                    Incident Timeline
                </h2>

                <div className="space-y-3">

                    {data.timeline?.map((item, index) => (

                        <div
                            key={index}
                            className="bg-zinc-800 rounded-xl p-4"
                        >

                            <p className="text-[#c026d3] font-semibold">
                                {item.time}
                            </p>

                            <p className="text-white">
                                {item.event}
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    );
}
function Card({ title, value }) {

    return (

        <div className="bg-zinc-800 rounded-xl p-5">

            <div className="text-zinc-400">

                {title}

            </div>

            <div className="text-2xl font-bold">

                {value}

            </div>

        </div>

    );

}