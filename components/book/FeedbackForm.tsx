"use client";

import { useState, type FormEvent } from "react";

// /feedback, in the landing page's type: lines to write on instead of boxes, the kind as three quiet choices, and
// sending as a line of type. It posts to /api/feedback exactly as before (type, title, description, contact).

type Kind = "bug" | "feature" | "general";
const Kinds: { value: Kind; label: string; placeholder: string }[] = [
  { value: "bug", label: "Bug report", placeholder: "What happened? What did you expect? Steps to reproduce..." },
  { value: "feature", label: "Feature request", placeholder: "Describe the feature you would like to see..." },
  { value: "general", label: "General feedback", placeholder: "Share your thoughts..." },
];

export default function FeedbackForm() {
  const [kind, setKind] = useState<Kind>("bug");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const ready = title.trim() !== "" && description.trim() !== "";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!ready || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: kind, title: title.trim(), description: description.trim(), contact: contact.trim() || null }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed");
      }
      setStatus("sent");
      setTitle(""); setDescription(""); setContact("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="fb-sent" role="status">
        <h2>Thank you.</h2>
        <p>Your feedback has been submitted. We’ll review it shortly.</p>
        <p className="back-line"><button className="act-line small" type="button" onClick={() => setStatus("idle")}>Send another <span className="ar" aria-hidden="true">→</span></button></p>
      </div>
    );
  }

  const placeholder = Kinds.find((k) => k.value === kind)!.placeholder;
  return (
    <form className="fb" onSubmit={submit} noValidate>
      <fieldset className="fb-kind">
        <legend>Kind</legend>
        {Kinds.map((k) => (
          <label key={k.value}>
            <input type="radio" name="kind" value={k.value} checked={kind === k.value} onChange={() => setKind(k.value)} />
            <span>{k.label}</span>
          </label>
        ))}
      </fieldset>
      <label className="fb-field">
        <span>Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="Brief summary of your feedback" />
      </label>
      <label className="fb-field">
        <span>Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={5000} rows={5} placeholder={placeholder} />
      </label>
      <label className="fb-field">
        <span>Contact <em>optional</em></span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={200} placeholder="Email or other way to reach you" autoComplete="email" />
      </label>
      {status === "error" && <p className="fb-error" role="alert">{error}</p>}
      <p className="fb-go">
        <button className="act-line" type="submit" disabled={!ready || status === "sending"}>
          <span className="swap" key={status === "sending" ? "s" : "i"}>
            {status === "sending" ? <>Sending</> : <>Send feedback <span className="ar" aria-hidden="true">→</span></>}
          </span>
        </button>
      </p>
    </form>
  );
}
