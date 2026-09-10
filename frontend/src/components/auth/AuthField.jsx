const AuthField = ({
  label,
  type = "text",
  name,
  placeholder,
  autoComplete,
  required = false,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="w-full rounded-xl border border-slate-600/80 bg-slate-950/30 px-3.5 py-2.5 text-base text-slate-100 placeholder:text-slate-500 transition duration-150 ease-in-out focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
    </label>
  );
};

export default AuthField;
