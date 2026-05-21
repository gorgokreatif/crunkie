import { CookieForm } from "../CookieForm";

export default function NewCookiePage() {
  return (
    <div className="p-8 lg:p-10">
      <div className="mb-8">
        <p className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.35em]" style={{ color: "#C79A5B" }}>
          Cookies
        </p>
        <h1 className="font-display text-3xl font-black" style={{ color: "#FFFDF8" }}>
          New Cookie
        </h1>
      </div>
      <div className="max-w-3xl">
        <CookieForm mode="new" />
      </div>
    </div>
  );
}
