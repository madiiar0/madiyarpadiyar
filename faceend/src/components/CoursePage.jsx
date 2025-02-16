import React from "react";
import { useParams } from "react-router-dom";

const CoursePage = () => {
    const { illness } = useParams();

    return (
        <div>
            <h1>Course for {illness}</h1>
            <p>The course content is not yet available.</p>
        </div>
    );
};

export default CoursePage;
