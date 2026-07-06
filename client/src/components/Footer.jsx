const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Boards", href: "/#boards" },
  { label: "Courses", href: "/#courses" },
  { label: "Blog", href: "/blogs" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "FAQ", href: "/#faqs" },
];

const phones = [
  { display: "+91 82105 34132", tel: "+918210534132" },
  { display: "+91 62993 36404", tel: "+916299336404" },
  { display: "+91 84098 35444", tel: "+918409835444" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {/* Brand */}
        <div>
          <p className="font-display text-lg font-bold text-white">
            Shree Admission <span className="text-saffron">Gurukul</span>
          </p>
          <p className="mt-2 text-sm">
            A unit of{" "}
            <a href="https://www.tribacblue.com/" className="text-saffron hover:text-saffron-600">
              Tribac Blue Classes.
            </a>
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className="transition hover:text-white">
                  {phone.display}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Shree Admission Gurukul. All rights reserved.</p>
          <p>
            Made by{" "}
            <a href="https://filliptechnologies.com/" className="text-saffron hover:text-saffron-600">
              Fillip Technologies
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
