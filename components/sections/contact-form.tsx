"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { PrimaryButton } from "@/components/ui/buttons";

type FormErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState("");

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    const nextErrors: FormErrors = {};
    if (name.length < 2) nextErrors.name = "Укажите имя — хотя бы 2 символа.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Укажите корректный адрес электронной почты.";
    if (message.length < 10) nextErrors.message = "Опишите вопрос подробнее — хотя бы 10 символов.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus("Проверьте отмеченные поля.");
      return;
    }

    const subject = encodeURIComponent("РЕМ КАРТА");
    const body = encodeURIComponent(`Имя: ${name}\nОбратный адрес: ${email}\n\n${message}`);
    setStatus("Открываем ваше почтовое приложение. Сообщение ещё не отправлено.");
    window.location.href = `mailto:menfise@mail.ru?subject=${subject}&body=${body}`;
  };

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="contact-form-heading">
        <span aria-hidden="true"><Mail /></span>
        <div>
          <h3>Написать автору проекта</h3>
          <p>Форма проверит поля и откроет ваше почтовое приложение. Сайт не отправляет и не хранит данные.</p>
        </div>
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="contact-name">Имя</label>
          <input id="contact-name" name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />
          {errors.name ? <span id="contact-name-error" className="field-error">{errors.name}</span> : null}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Электронная почта</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
          {errors.email ? <span id="contact-email-error" className="field-error">{errors.email}</span> : null}
        </div>
      </div>
      <div className="field">
        <label htmlFor="contact-message">Сообщение</label>
        <textarea id="contact-message" name="message" rows={4} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} placeholder="Вопрос, предложение или контекст ошибки — без данных пациентов" />
        {errors.message ? <span id="contact-message-error" className="field-error">{errors.message}</span> : null}
      </div>
      <div className="contact-form-footer">
        <PrimaryButton type="submit"><Send size={17} aria-hidden="true" />Подготовить письмо</PrimaryButton>
        <p className="form-status" role="status">{status}</p>
      </div>
    </form>
  );
}
