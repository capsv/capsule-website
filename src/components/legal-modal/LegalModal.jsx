import React from 'react';
import './LegalModal.css';

function LegalModal({ isOpen, onClose, type, language }) {
    if (!isOpen) return null;

    const content = {
        en: {
            terms: {
                title: "Terms of Service",
                text: `Welcome to the platform designed for people seeking to overcome social anxiety and improve their communication skills.

Please read the following terms carefully:

1. Platform Purpose
The platform provides access to educational materials, assignments, exercises, and other digital tools aimed at reducing social anxiety. This is not a medical or psychotherapeutic service and is not intended for diagnosing or treating social phobia, anxiety disorders, or other mental health conditions.

2. User Obligations
You agree to:

• use the platform in good faith, without violating laws or the rights of other users;

• not post offensive, discriminatory, or harmful content;

• not use the platform for trolling, harassment, or destructive activities.

3. Liability
We do not guarantee achieving specific results. The effectiveness of exercises depends on your engagement, regularity, and individual characteristics.

The platform is intended for personal development and self-help, not as a replacement for professional therapy.

4. Changes to Terms
We may periodically update these terms. Using the platform after changes means your agreement to them.`
            },
            privacy: {
                title: "Privacy Policy",
                text: `We respect your privacy and strive to protect any personal data you provide.

1. What Data We Collect
• Username, email address, password (encrypted);

• Platform activity data (completed tasks, test results, etc.);

• Statistical information necessary for service improvement.

2. How We Use Data
• To personalize content and recommendations;

• To analyze overall platform effectiveness;

• To improve user experience.

We do not sell or transfer your data to third parties.

3. Security
We use modern information protection methods, including encryption, access restrictions, and regular security audits.

4. Data Deletion
You can delete your account at any time. After deletion, all personal data will be erased from the system within a reasonable timeframe.`
            },
            close: "Close"
        },
        ru: {
            terms: {
                title: "Условия использования",
                text: `Добро пожаловать на платформу, предназначенную для людей, стремящихся преодолеть социальную тревожность и улучшить свои навыки общения.

Пожалуйста, внимательно прочтите следующие условия:

1. Назначение платформы

1.1 Платформа предоставляет доступ к образовательным материалам, заданиям, упражнениям и другим цифровым инструментам, направленным на снижение социальной тревожности. Это не является медицинским или психотерапевтическим сервисом и не предназначено для диагностики или лечения социофобии, тревожных расстройств или других ментальных состояний.

2. Пользовательские обязательства

Вы соглашаетесь:

• использовать платформу добросовестно, не нарушая законы и права других пользователей;

• не размещать оскорбительный, дискриминирующий или вредоносный контент;

• не использовать платформу в целях троллинга, харассмента или деструктивной активности.

3. Ответственность

3.1 Мы не гарантируем достижение конкретного результата. 

3.2 Эффективность выполнения упражнений зависит от вашей вовлечённости, регулярности и индивидуальных особенностей.


3.3 Платформа предназначена для личного развития и самопомощи, а не замены профессиональной терапии.

4. Изменения условий

4.1 Мы можем периодически обновлять эти условия. Использование платформы после изменений означает ваше согласие с ними.`
            },
            privacy: {
                title: "Политика конфиденциальности",
                text: `Мы уважаем вашу конфиденциальность и стараемся защищать любые персональные данные, которые вы предоставляете.

1. Какие данные мы собираем:

1.1 Имя пользователя, адрес электронной почты, пароль (зашифрованный);

1.2 Данные активности на платформе (выполненные задания, результаты тестов и т.п.);

1.3 Статистическая информация, необходимая для улучшения сервиса.

2. Как мы используем данные:

2.1 Для персонализации контента и рекомендаций;

2.2 Для анализа общей эффективности платформы;

2.3 Для улучшения пользовательского опыта.

3. Мы не продаём и не передаём ваши данные третьим лицам.

4. Безопасность

4.1 Мы используем современные методы защиты информации, включая шифрование, ограничение доступа и регулярный аудит безопасности.

5. Удаление данных

5.1 Вы можете удалить свой аккаунт в любой момент. После удаления все персональные данные будут стерты из системы в разумные сроки.`

            },
            close: "Закрыть"
        }
    };

    const currentContent = content[language] || content.en;
    const documentContent = currentContent[type] || currentContent.terms;

    return (
        <div className="legal-modal-overlay" onClick={onClose}>
            <div className="legal-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="legal-modal-header">
                    <h2>{documentContent.title}</h2>
                    <button 
                        className="legal-modal-close" 
                        onClick={onClose}
                        aria-label={currentContent.close}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                <div className="legal-modal-body">
                    <div className="legal-text">
                        {documentContent.text.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
                
                <div className="legal-modal-footer">
                    <button className="legal-modal-close-btn" onClick={onClose}>
                        {currentContent.close}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LegalModal; 