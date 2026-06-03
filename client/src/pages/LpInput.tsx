import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

/**
 * /lp-input — Public form for Pakistan team to register new restaurant leads.
 * No authentication required.
 * Collects all data needed to generate a premium LP at /r/{slug}.
 */

type MenuItem = { name: string; desc: string; price: string };

export default function LpInput() {
  const [submitted, setSubmitted] = useState(false);
  const [resultSlug, setResultSlug] = useState('');
  const [resultId, setResultId] = useState(0);

  // Form state
  const [storeName, setStoreName] = useState('');
  const [area, setArea] = useState('');
  const [businessType, setBusinessType] = useState<'restaurant' | 'salon'>('restaurant');
  const [businessSubtype, setBusinessSubtype] = useState('');
  const [notes, setNotes] = useState('');

  // Contact
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Ambiance
  const [template, setTemplate] = useState('restaurant-luxury');
  const [ambianceLighting, setAmbianceLighting] = useState('');
  const [ambianceSurfaces, setAmbianceSurfaces] = useState('');
  const [ambianceColorPalette, setAmbianceColorPalette] = useState('');
  const [ambianceMood, setAmbianceMood] = useState('');
  const [ambianceTimeOfDay, setAmbianceTimeOfDay] = useState('');
  const [paletteAccent, setPaletteAccent] = useState('#B0552F');

  // Content
  const [heroTagline, setHeroTagline] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [storyParagraphs, setStoryParagraphs] = useState('');
  const [atmosphereCaption, setAtmosphereCaption] = useState('');
  const [ctaTitle, setCtaTitle] = useState('');
  const [ctaSubtitle, setCtaSubtitle] = useState('');

  // Menu
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { name: '', desc: '', price: '' },
  ]);

  // Gallery
  const [galleryImages, setGalleryImages] = useState('');
  const [galleryCaptions, setGalleryCaptions] = useState('');

  // Info
  const [infoAddress, setInfoAddress] = useState('');
  const [infoHours, setInfoHours] = useState('');
  const [infoPhone, setInfoPhone] = useState('');
  const [infoReservationUrl, setInfoReservationUrl] = useState('');

  // Source photos (for video pipeline)
  const [sourcePhotos, setSourcePhotos] = useState('');

  const createLead = trpc.leads.create.useMutation();

  const handleAddMenuItem = () => {
    setMenuItems([...menuItems, { name: '', desc: '', price: '' }]);
  };

  const handleRemoveMenuItem = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: keyof MenuItem, value: string) => {
    const updated = [...menuItems];
    updated[index] = { ...updated[index], [field]: value };
    setMenuItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName.trim() || !area.trim()) {
      toast.error('Store Name and Area are required.');
      return;
    }

    try {
      const result = await createLead.mutateAsync({
        store_name: storeName.trim(),
        area: area.trim(),
        business_type: businessType,
        business_subtype: businessSubtype || undefined,
        notes: notes || undefined,
        google_maps_url: googleMapsUrl || undefined,
        instagram_url: instagramUrl || undefined,
        phone_number: phoneNumber || undefined,
        email: email || undefined,
        whatsapp_number: whatsappNumber || undefined,
        template: template || undefined,
        ambiance_lighting: ambianceLighting || undefined,
        ambiance_surfaces: ambianceSurfaces || undefined,
        ambiance_color_palette: ambianceColorPalette || undefined,
        ambiance_mood: ambianceMood || undefined,
        ambiance_time_of_day: ambianceTimeOfDay || undefined,
        palette_accent: paletteAccent || undefined,
        hero_tagline: heroTagline || undefined,
        hero_subtitle: heroSubtitle || undefined,
        story_paragraphs: storyParagraphs ? storyParagraphs.split('\n').filter(Boolean) : undefined,
        atmosphere_caption: atmosphereCaption || undefined,
        cta_title: ctaTitle || undefined,
        cta_subtitle: ctaSubtitle || undefined,
        menu_items: menuItems.filter(m => m.name.trim()).map(m => ({
          name: m.name.trim(),
          desc: m.desc.trim() || undefined,
          price: m.price.trim() || undefined,
        })),
        gallery_images: galleryImages ? galleryImages.split('\n').filter(Boolean) : undefined,
        gallery_captions: galleryCaptions ? galleryCaptions.split('\n').filter(Boolean) : undefined,
        source_photos: sourcePhotos ? sourcePhotos.split('\n').filter(Boolean) : undefined,
        info_address: infoAddress || undefined,
        info_hours: infoHours || undefined,
        info_phone: infoPhone || undefined,
        info_reservation_url: infoReservationUrl || undefined,
      });

      setResultSlug(result.slug);
      setResultId(result.id);
      setSubmitted(true);
      toast.success('LP created successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create LP');
    }
  };

  if (submitted) {
    const lpUrl = `${window.location.origin}/r/${resultSlug}`;
    return (
      <div className="min-h-screen bg-[#0E0D0C] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="space-y-2">
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-sans">
              LP Factory
            </p>
            <h1 className="text-3xl font-light text-white/90 italic" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
              Site Created
            </h1>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-4">
            <p className="text-white/60 text-sm">LP URL:</p>
            <a
              href={lpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B0552F] hover:text-[#D4723F] text-lg break-all transition-colors"
            >
              {lpUrl}
            </a>
            <div className="pt-4 flex gap-3 justify-center">
              <button
                onClick={() => navigator.clipboard.writeText(lpUrl).then(() => toast.success('Copied!'))}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded transition-colors"
              >
                Copy URL
              </button>
              <button
                onClick={() => { setSubmitted(false); setResultSlug(''); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded transition-colors"
              >
                Create Another
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs">
            ID: {resultId} • Video pipeline has been triggered automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F3] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#0E0D0C]/40 text-xs tracking-[0.3em] uppercase mb-2">
            LP Factory
          </p>
          <h1
            className="text-4xl font-light text-[#0E0D0C] italic"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            New Restaurant LP
          </h1>
          <p className="text-[#0E0D0C]/50 text-sm mt-3">
            Fill in the details below to generate a premium landing page.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* === Basic Info === */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Store Name *" value={storeName} onChange={setStoreName} placeholder="La Letizia" />
              <Field label="Area *" value={area} onChange={setArea} placeholder="Dubai Marina" />
              <SelectField
                label="Business Type"
                value={businessType}
                onChange={(v) => setBusinessType(v as 'restaurant' | 'salon')}
                options={[
                  { value: 'restaurant', label: 'Restaurant' },
                  { value: 'salon', label: 'Salon' },
                ]}
              />
              <Field label="Subtype" value={businessSubtype} onChange={setBusinessSubtype} placeholder="cafe, steakhouse, japanese..." />
            </div>
            <TextArea label="Notes" value={notes} onChange={setNotes} placeholder="Brief description of the restaurant..." rows={3} />
          </Section>

          {/* === Contact === */}
          <Section title="Contact Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Google Maps URL" value={googleMapsUrl} onChange={setGoogleMapsUrl} placeholder="https://maps.google.com/..." />
              <Field label="Instagram URL" value={instagramUrl} onChange={setInstagramUrl} placeholder="https://instagram.com/..." />
              <Field label="Phone Number" value={phoneNumber} onChange={setPhoneNumber} placeholder="+971 4 555 0123" />
              <Field label="Email" value={email} onChange={setEmail} placeholder="info@restaurant.com" />
              <Field label="WhatsApp" value={whatsappNumber} onChange={setWhatsappNumber} placeholder="+971..." />
            </div>
          </Section>

          {/* === Ambiance & Style === */}
          <Section title="Ambiance & Style">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Template"
                value={template}
                onChange={setTemplate}
                options={[
                  { value: 'restaurant-luxury', label: 'Restaurant Luxury' },
                  { value: 'restaurant-casual', label: 'Restaurant Casual' },
                  { value: 'salon-luxury', label: 'Salon Luxury' },
                ]}
              />
              <SelectField
                label="Lighting"
                value={ambianceLighting}
                onChange={setAmbianceLighting}
                options={[
                  { value: '', label: '— Auto detect —' },
                  { value: 'warm_golden', label: 'Warm Golden' },
                  { value: 'cool_neutral', label: 'Cool Neutral' },
                  { value: 'dim_moody', label: 'Dim Moody' },
                  { value: 'bright_natural', label: 'Bright Natural' },
                ]}
              />
              <SelectField
                label="Surfaces"
                value={ambianceSurfaces}
                onChange={setAmbianceSurfaces}
                options={[
                  { value: '', label: '— Auto detect —' },
                  { value: 'marble', label: 'Marble' },
                  { value: 'wood', label: 'Wood' },
                  { value: 'concrete', label: 'Concrete' },
                  { value: 'leather', label: 'Leather' },
                  { value: 'mixed', label: 'Mixed' },
                ]}
              />
              <SelectField
                label="Color Palette"
                value={ambianceColorPalette}
                onChange={setAmbianceColorPalette}
                options={[
                  { value: '', label: '— Auto detect —' },
                  { value: 'warm_earth', label: 'Warm Earth' },
                  { value: 'cool_neutral', label: 'Cool Neutral' },
                  { value: 'dark_dramatic', label: 'Dark Dramatic' },
                  { value: 'bright_airy', label: 'Bright Airy' },
                ]}
              />
              <SelectField
                label="Mood"
                value={ambianceMood}
                onChange={setAmbianceMood}
                options={[
                  { value: '', label: '— Auto detect —' },
                  { value: 'refined', label: 'Refined' },
                  { value: 'cozy', label: 'Cozy' },
                  { value: 'energetic', label: 'Energetic' },
                  { value: 'intimate', label: 'Intimate' },
                  { value: 'dramatic', label: 'Dramatic' },
                ]}
              />
              <SelectField
                label="Time of Day"
                value={ambianceTimeOfDay}
                onChange={setAmbianceTimeOfDay}
                options={[
                  { value: '', label: '— Auto detect —' },
                  { value: 'morning', label: 'Morning' },
                  { value: 'midday', label: 'Midday' },
                  { value: 'golden_hour', label: 'Golden Hour' },
                  { value: 'evening', label: 'Evening' },
                  { value: 'night', label: 'Night' },
                ]}
              />
            </div>
            <div className="mt-4">
              <label className="block text-xs text-[#0E0D0C]/50 uppercase tracking-wider mb-1.5">
                Accent Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={paletteAccent}
                  onChange={(e) => setPaletteAccent(e.target.value)}
                  className="w-10 h-10 rounded border border-[#0E0D0C]/10 cursor-pointer"
                />
                <input
                  type="text"
                  value={paletteAccent}
                  onChange={(e) => setPaletteAccent(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm"
                  placeholder="#B0552F"
                />
              </div>
            </div>
          </Section>

          {/* === Content === */}
          <Section title="Content & Copy">
            <div className="space-y-4">
              <Field label="Hero Tagline" value={heroTagline} onChange={setHeroTagline} placeholder="Marina Daylight, Slow Coffee" />
              <Field label="Hero Subtitle" value={heroSubtitle} onChange={setHeroSubtitle} placeholder="A marble counter, a clear glass of water..." />
              <TextArea
                label="Story Paragraphs (one per line)"
                value={storyParagraphs}
                onChange={setStoryParagraphs}
                placeholder="A place where mornings stretch longer...&#10;Marble surfaces catch the light..."
                rows={4}
              />
              <Field label="Atmosphere Caption" value={atmosphereCaption} onChange={setAtmosphereCaption} placeholder="Where mornings stretch longer." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="CTA Title" value={ctaTitle} onChange={setCtaTitle} placeholder="Your table is waiting" />
                <Field label="CTA Subtitle" value={ctaSubtitle} onChange={setCtaSubtitle} placeholder="Experience [Store] in person." />
              </div>
            </div>
          </Section>

          {/* === Menu === */}
          <Section title="Menu Items">
            <div className="space-y-3">
              {menuItems.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleMenuItemChange(i, 'name', e.target.value)}
                      placeholder="Item name"
                      className="px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleMenuItemChange(i, 'desc', e.target.value)}
                      placeholder="Description"
                      className="px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm"
                    />
                    <input
                      type="text"
                      value={item.price}
                      onChange={(e) => handleMenuItemChange(i, 'price', e.target.value)}
                      placeholder="AED 28"
                      className="px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMenuItem(i)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddMenuItem}
                className="text-sm text-[#B0552F] hover:text-[#D4723F] transition-colors"
              >
                + Add menu item
              </button>
            </div>
          </Section>

          {/* === Gallery === */}
          <Section title="Gallery & Media">
            <TextArea
              label="Gallery Image URLs (one per line)"
              value={galleryImages}
              onChange={setGalleryImages}
              placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              rows={4}
            />
            <TextArea
              label="Gallery Captions (one per line, matching image order)"
              value={galleryCaptions}
              onChange={setGalleryCaptions}
              placeholder="The pour&#10;The space&#10;Morning ritual"
              rows={3}
            />
            <TextArea
              label="Source Photos for Video (one URL per line)"
              value={sourcePhotos}
              onChange={setSourcePhotos}
              placeholder="https://example.com/source1.jpg&#10;https://example.com/source2.jpg"
              rows={3}
            />
          </Section>

          {/* === Info === */}
          <Section title="Store Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextArea label="Address" value={infoAddress} onChange={setInfoAddress} placeholder="Dubai Marina Walk&#10;Tower 3, Ground Floor&#10;Dubai, UAE" rows={3} />
              <div className="space-y-4">
                <Field label="Hours" value={infoHours} onChange={setInfoHours} placeholder="Daily 7:00 AM – 4:00 PM" />
                <Field label="Phone" value={infoPhone} onChange={setInfoPhone} placeholder="+971 4 555 0123" />
                <Field label="Reservation URL" value={infoReservationUrl} onChange={setInfoReservationUrl} placeholder="https://..." />
              </div>
            </div>
          </Section>

          {/* === Submit === */}
          <div className="pt-6 border-t border-[#0E0D0C]/10">
            <button
              type="submit"
              disabled={createLead.isPending}
              className="w-full py-4 bg-[#0E0D0C] text-white rounded-lg text-sm uppercase tracking-[0.2em] hover:bg-[#1a1918] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLead.isPending ? 'Creating...' : 'Generate LP'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Reusable form components ────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-[#0E0D0C]/80 border-b border-[#0E0D0C]/10 pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs text-[#0E0D0C]/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm focus:outline-none focus:border-[#B0552F]/40 transition-colors"
      />
    </div>
  );
}

function TextArea({
  label, value, onChange, placeholder, rows = 3,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-xs text-[#0E0D0C]/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm resize-y focus:outline-none focus:border-[#B0552F]/40 transition-colors"
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs text-[#0E0D0C]/50 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-[#0E0D0C]/10 bg-white text-sm focus:outline-none focus:border-[#B0552F]/40 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
