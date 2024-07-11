export default function FormatDate({ dateObject }: { dateObject: Date }) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return dateObject.toLocaleDateString("en-US", options);
}
