import { JSX } from 'react';
import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type JsonField<T> = { jsonValue: T };
type SF = JsonField<Field<string>> | undefined;

type ExperienceDataFields = {
  data?: {
    externalFields?: {
      BusinessName?: SF;
      IPAddress?: SF;
      ISP?: SF;
      DNS?: SF;
      City?: SF;
      Region?: SF;
      Country?: SF;
      PostalCode?: SF;
      MetroCode?: SF;
      Latitude?: SF;
      Longitude?: SF;
      AreaCode?: SF;
      Referrer?: SF;
      Url?: SF;
      HTMLContent?: SF;
    };
  };
};

type ExperienceDataProps = ComponentProps & {
  fields?: ExperienceDataFields;
};

const v = (f: SF): string => (f?.jsonValue?.value || '').trim();

/**
 * Mirrors the XP "Demo Sidebar" rendering: shows the GeoIP / visit-context data
 * stored on a Demo Page item, plus its optional HTML Content block. Renders
 * nothing when the context page has no Experience Data populated (e.g. on a
 * regular page that just inherits the design's empty Demo Sidebar partial).
 */
const ExperienceData = ({ fields }: ExperienceDataProps): JSX.Element => {
  const ext = fields?.data?.externalFields;
  if (!ext) return <></>;

  const rows: Array<[string, string]> = [
    ['Business name', v(ext.BusinessName)],
    ['IP address', v(ext.IPAddress)],
    ['ISP', v(ext.ISP)],
    ['DNS', v(ext.DNS)],
    ['City', v(ext.City)],
    ['Region', v(ext.Region)],
    ['Country', v(ext.Country)],
    ['Postal code', v(ext.PostalCode)],
    ['Metro code', v(ext.MetroCode)],
    ['Latitude', v(ext.Latitude)],
    ['Longitude', v(ext.Longitude)],
    ['Area code', v(ext.AreaCode)],
    ['Referrer', v(ext.Referrer)],
    ['URL', v(ext.Url)],
  ].filter(([, val]) => !!val) as Array<[string, string]>;

  const html = ext.HTMLContent?.jsonValue;
  const hasHtml = !!html?.value;

  if (rows.length === 0 && !hasHtml) return <></>;

  return (
    <section className="experience-data mx-auto max-w-4xl px-6 py-8">
      {rows.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Experience data
          </h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            {rows.map(([label, val]) => (
              <div key={label} className="flex justify-between gap-4 border-b border-gray-100 py-1">
                <dt className="text-gray-500">{label}</dt>
                <dd className="font-medium text-gray-800">{val}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
      {hasHtml && (
        <div className="prose max-w-none text-gray-700 mt-6 [&_p]:mb-3">
          <RichText field={html} />
        </div>
      )}
    </section>
  );
};

export default ExperienceData;
