import { useState, useEffect } from "react";

function CountdownTimer({ deadline, onExpire }) {
    const calculateTimeLeft = () => {
        if (!deadline) return null;

        const difference = +new Date(deadline) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60))),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = { hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            const nextTime = calculateTimeLeft();
            setTimeLeft(nextTime);

            if (nextTime.expired && onExpire) {
                onExpire();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    if (!timeLeft) return null;

    if (timeLeft.expired) {
        return <span className="text-red-500 font-bold uppercase text-[10px] tracking-widest">Bidding Closed</span>;
    }

    const { hours, minutes, seconds } = timeLeft;

    const format = (num) => String(num).padStart(2, '0');

    return (
        <span className="font-mono font-bold">
            {format(hours)}:{format(minutes)}:{format(seconds)}
        </span>
    );
}

export default CountdownTimer;
