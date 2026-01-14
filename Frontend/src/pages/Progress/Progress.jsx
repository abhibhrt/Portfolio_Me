import React, { useEffect, useState } from "react";
import classNames from "classnames";
import "./Progress.css";
import axios from 'axios';

const Progress = () => {
    const [isLoading, setIsLoading] = useState(
      <div className="loading-screen"><span className="loader"></span></div>
    );
    const [monthOffset, setMonthOffset] = useState(0);
    const [activeNote, setActiveNote] = useState(null);
    const [activeRecord, setActiveRecord] = useState(null);
    const [progressData, setProgress] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URI}/api/progress`);
                console.log(res)
                setProgress(res.data.data);
                setIsLoading(null);
            } catch {
                console.log('error occurred');
            }
        }
        fetchData();
    }, []);

    // Generate contribution data from progressData
    const contributionData = {};
    progressData.forEach(item => {
        const [year, month] = item.date.split('-');
        const day = parseInt(item.date.split('-')[2]);
        const monthKey = `${year}-${month}`;

        if (!contributionData[monthKey]) {
            const daysInMonth = new Date(year, month, 0).getDate();
            contributionData[monthKey] = Array(daysInMonth).fill(0);
        }

        if (item.status === 1) {
            contributionData[monthKey][day - 1] = 1;
        }
    });

    const getMonthInfo = (offset = 0) => {
        const today = new Date();
        const currentDate = new Date(today);
        currentDate.setMonth(currentDate.getMonth() + offset);
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const key = `${year}-${String(month + 1).padStart(2, "0")}`;
        const contributions = contributionData[key] || Array(daysInMonth).fill(0);

        const dates = [];
        for (let i = 0; i < firstDay; i++) {
            dates.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            dates.push(new Date(year, month, i));
        }

        const monthName = currentDate.toLocaleString("default", { month: "long" });
        const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

        return {
            dates,
            contributions,
            monthName,
            year,
            isCurrentMonth,
        };
    };

    const { dates, contributions, monthName, year, isCurrentMonth } = getMonthInfo(monthOffset);

    const handleNext = () => {
        if (!isCurrentMonth) setMonthOffset((prev) => prev + 1);
    };

    const handlePrev = () => {
        setMonthOffset((prev) => prev - 1);
    };

    const handleNoteClick = (note) => {
        setActiveNote(note);
        setActiveRecord(null);
    };

    const handleRecordClick = (record) => {
        setActiveRecord(record);
        setActiveNote(null);
    };

    const closePopup = () => {
        setActiveNote(null);
        setActiveRecord(null);
    };

    const categories = [...new Set(progressData.map(item => item.category))];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredData = selectedCategory === "All"
        ? progressData
        : progressData.filter(item => item.category === selectedCategory);

    return (
        <section className="progress-tracker-section">
            {isLoading}
            <div className="progress-tracker-container">
                <h1 className="progress-tracker-section-title">Progress</h1>

                <div className="progress-tracker-categories">
                    <button
                        className={classNames("progress-tracker-category-btn", {
                            active: selectedCategory === "All"
                        })}
                        onClick={() => setSelectedCategory("All")}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category}
                            className={classNames("progress-tracker-category-btn", {
                                active: selectedCategory === category
                            })}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="progress-tracker-view">
                    <div className="progress-tracker-table-container">
                        <table className="progress-tracker-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Note</th>
                                    <th>Record</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.date}</td>
                                        <td>{item.category}</td>
                                        <td>
                                            {item.status === 1 ? (
                                                <span className="progress-tracker-status-check">✓</span>
                                            ) : (
                                                <span className="progress-tracker-status-cross">✗</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="progress-tracker-note-btn"
                                                onClick={() => handleNoteClick(item.note)}
                                            >
                                                📝
                                            </button>
                                        </td>
                                        <td>
                                            {item.record.length > 0 ? (
                                                <button
                                                    className="progress-tracker-record-btn"
                                                    onClick={() => handleRecordClick(item.record)}
                                                >
                                                    🔗
                                                </button>
                                            ) : (
                                                <span>-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="progress-tracker-calendar-container">
                        <div className="progress-tracker-calendar">
                            <div className="progress-tracker-calendar-header">
                                <h2>{monthName} {year}</h2>
                                <div className="progress-tracker-calendar-controls">
                                    <button onClick={handlePrev}>&#8592;</button>
                                    <button
                                        onClick={handleNext}
                                        disabled={isCurrentMonth}>
                                        &#8594;
                                    </button>
                                </div>
                            </div>

                            <div className="progress-tracker-calendar-days">
                                {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                                    <div key={day} className="progress-tracker-calendar-day-label">{day}</div>
                                ))}
                            </div>

                            <div className="progress-tracker-calendar-grid">
                                {dates.map((date, index) => {
                                    if (!date) {
                                        return <div key={index} className="progress-tracker-calendar-cell empty"></div>;
                                    }
                                    const day = date.getDate();
                                    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                    const hasEntry = progressData.some(item => item.date === dateStr);

                                    return (
                                        <div
                                            key={index}
                                            className={classNames("progress-tracker-calendar-cell", {
                                                "has-entry": hasEntry,
                                                "contributed": contributions[day - 1] === 1,
                                                "not-contributed": contributions[day - 1] === 0
                                            })}
                                            title={date.toDateString()}
                                        >
                                            {day}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note Popup */}
            {activeNote && (
                <div className="progress-tracker-popup-overlay">
                    <div className="progress-tracker-note-popup">
                        <button
                            className="progress-tracker-popup-close"
                            onClick={closePopup}>
                            ×
                        </button>
                        <h3>Note</h3>
                        <div className="progress-tracker-note-content" 
                             style={{ whiteSpace: "pre-wrap" }}>
                            {activeNote}
                        </div>
                    </div>
                </div>
            )}

            {/* Record Popup */}
            {activeRecord && (
                <div className="progress-tracker-popup-overlay">
                    <div className="progress-tracker-record-popup">
                        <button
                            className="progress-tracker-popup-close"
                            onClick={closePopup}>
                            ×
                        </button>
                        <h3>Resources</h3>
                        <ul>
                            {activeRecord.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        👉 Resource {index + 1}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Progress;