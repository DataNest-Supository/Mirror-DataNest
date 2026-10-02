import fs from "node:fs";
import path from "node:path";
import Link from "next/link";

export const metadata = {
  title: "DataNest System Charter",
  description:
    "Public DataNest system charter covering scope, mission, governance, architecture, assurance and transparency."
};

const charter = fs.readFileSync(
  path.join(process.cwd(), "docs/DATANEST_SYSTEM_CHARTER.md"),
  "utf8"
);

export default function SystemCharterPage() {
  return (
    <main className="publicReportPage">
      <header>
        <Link href="/transparency">← Public Transparency</Link>
        <a href="https://github.com/DataNest-Supository/Mirror-DataNest/blob/main/docs/DATANEST_SYSTEM_CHARTER.md">
          Source ↗
        </a>
      </header>
      <article>
        <p className="eyebrow">PUBLISHED SYSTEM CHARTER</p>
        <h1>DataNest System Charter</h1>
        <p className="muted">
          The source-controlled system charter is rendered directly in this public
          Mirror page. It is an evidence and governance reference and does not by
          itself grant production, financial, legal or certification authority.
        </p>
        <div className="publicReportFrame">
          <pre>{charter}</pre>
        </div>
      </article>
    </main>
  );
}
