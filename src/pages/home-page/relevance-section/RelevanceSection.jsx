import React from "react";
import {useInView} from "react-intersection-observer";
import PropTypes from "prop-types";
import "./RelevanceSection.css"

const RelevanceSection = ({content}) => {
    const {ref: refCard1, inView: inViewCard1} = useInView({triggerOnce: true});
    const {ref: refCard2, inView: inViewCard2} = useInView({triggerOnce: true});
    const {ref: refImage, inView: inViewImage} = useInView({triggerOnce: true});

    return (
        <section className="relevance-section">
            <h2>{content.relevance}</h2>
            <div className="relevance-cards">
                <div ref={refCard1} className={`relevance-card ${inViewCard1 ? 'fade-in-left' : ''}`}>
                    <h3>Word stat</h3>
                    <p>{content.relevanceDescriptionCardOne}</p>
                    <img src="/photos/Anxiety-pana.svg" alt="Anxiety" className="relevance-image-svg"/>
                </div>
                <div ref={refCard2} className={`relevance-card ${inViewCard2 ? 'fade-in-right' : ''}`}>
                    <h3>Word stat</h3>
                    <p>{content.relevanceDescriptionCardTwo}</p>
                    <img src="/photos/Blaming-pana.svg" alt="Social Anxiety" className="relevance-image-svg"/>
                </div>
            </div>
            <div ref={refImage} className={`relevance-image-container ${inViewImage ? 'fade-in-up' : ''}`}>
                <h3>Word stat</h3>
                <img src="/photos/chart.png" alt="Relevance" className="relevance-image"/>
            </div>
        </section>
    );
};

RelevanceSection.propTypes = {
    content: PropTypes.shape({
        relevance: PropTypes.string.isRequired,
        relevanceDescriptionCardOne: PropTypes.string.isRequired,
        relevanceDescriptionCardTwo: PropTypes.string.isRequired,
    }).isRequired,
};

export default RelevanceSection;