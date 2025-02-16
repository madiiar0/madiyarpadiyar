import React from "react";

const ScaleBar = ({ value }) => {
    return (
        <div>
            <h1>1-100 Scale</h1>
            <p>Enter your sub-headline here</p>
            <div>
                <div style={{ left: `${value}%` }}></div>
            </div>
            <div>
                {[1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                    <div key={num}>
                        <strong>{num}</strong>
                        <br />
                        <span>Sample Headline</span>
                        <br />
                        <span>This is a sample text you can edit</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ScaleBar;
