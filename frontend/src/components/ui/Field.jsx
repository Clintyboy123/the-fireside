// Form controls: label above, hairline underneath that turns gold on focus, error text linked by aria-describedby.
const control =
  'peer block w-full appearance-none rounded-none border-0 border-b bg-transparent px-0 pb-3 pt-2 text-lead text-cream placeholder:text-ash/70 focus:outline-none transition-colors duration-300 ease-site';

export function Field({ id, label, error, hint, as = 'input', children, className = '', ...props }) {
  const Tag = as;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div className={`text-left ${className}`}>
      <label htmlFor={id} className="label block text-smoke">
        {label}
      </label>
      <Tag
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${control} ${error ? 'border-danger' : 'border-cream/25 focus:border-gold'} ${as === 'textarea' ? 'min-h-28 resize-y' : ''} ${as === 'select' ? 'cursor-pointer pr-8' : ''}`}
        {...props}
      >
        {children}
      </Tag>
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-small text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-small text-ash">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
