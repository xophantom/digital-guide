import { Chip } from "@/src/components/atoms/Chip";
import { PhotoGallery } from "@/src/components/molecules/PhotoGallery";
import { amenityEntries } from "@/src/components/amenities";
import type { Property } from "@/src/domain/property";

export function PropertyHero({ property }: { property: Property }) {
  return (
    <section>
      <PhotoGallery images={property.images} />
      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-(--accent)">
        {property.propertyType} · {property.address.neighborhood} ·{" "}
        {property.address.city} — {property.address.state}
      </p>
      <h1 className="mt-1 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {property.name}
      </h1>
      <div className="mt-3 flex flex-wrap gap-2">
        <Chip icon="bed">{property.bedroomQuantity} quartos</Chip>
        <Chip icon="bath">{property.bathroomQuantity} banheiros</Chip>
        <Chip icon="guests">{property.guestCapacity} hóspedes</Chip>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {amenityEntries(property.amenities).map((a) => (
          <Chip key={a.key} icon={a.icon}>
            {a.label}
          </Chip>
        ))}
      </div>
    </section>
  );
}
