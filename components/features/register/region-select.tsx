"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Loader2, ChevronDown } from "lucide-react";

interface Region {
  id: string;
  name: string;
}

interface RegionSelectProps {
  provinceId?: string;
  regencyId?: string;
  districtId?: string;
  villageId?: string;
  onProvinceChange?: (id: string) => void;
  onRegencyChange?: (id: string) => void;
  onDistrictChange?: (id: string) => void;
  onVillageChange?: (id: string) => void;
  onChange?: (field: string, value: string) => void;
  errors?: Record<string, string>;
  defaultProvince?: string;
  defaultRegency?: string;
  defaultDistrict?: string;
  defaultVillage?: string;
}

// Native select-based region dropdown component
function NativeSelect({
  label,
  value,
  options,
  onChange,
  disabled,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  options: Region[];
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-pri-silver">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-pri-navy border border-pri-gold/20 rounded-lg px-3 py-2.5 pr-8 text-sm text-white 
            focus:outline-none focus:border-pri-red/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed
            [&>option]:bg-pri-navy [&>option]:text-white"
        >
          <option value="" className="text-pri-silver/50">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/50 pointer-events-none" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function RegionSelect(props: RegionSelectProps) {
  const {
    provinceId,
    regencyId,
    districtId,
    villageId,
    onProvinceChange,
    onRegencyChange,
    onDistrictChange,
    onVillageChange,
    onChange,
    errors,
    defaultProvince,
    defaultRegency,
    defaultDistrict,
    defaultVillage,
  } = props;

  const supabase = createClient();

  // State for selections
  const [selectedProvince, setSelectedProvince] = useState(provinceId || defaultProvince || "");
  const [selectedRegency, setSelectedRegency] = useState(regencyId || defaultRegency || "");
  const [selectedDistrict, setSelectedDistrict] = useState(districtId || defaultDistrict || "");
  const [selectedVillage, setSelectedVillage] = useState(villageId || defaultVillage || "");

  // State for options
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  const [loading, setLoading] = useState({ provinces: false, regencies: false, districts: false, villages: false });

  // Fetch provinces on mount
  useEffect(() => {
    setLoading((p) => ({ ...p, provinces: true }));
    supabase
      .from("provinces")
      .select("id, name")
      .order("name")
      .then(({ data }) => {
        setProvinces(data ?? []);
        setLoading((p) => ({ ...p, provinces: false }));
      });
  }, [supabase]);

  // Fetch regencies when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setRegencies([]);
      return;
    }
    setLoading((p) => ({ ...p, regencies: true }));
    supabase
      .from("regencies")
      .select("id, name")
      .eq("province_id", selectedProvince)
      .order("name")
      .then(({ data }) => {
        setRegencies(data ?? []);
        setLoading((p) => ({ ...p, regencies: false }));
      });
  }, [supabase, selectedProvince]);

  // Fetch districts when regency changes
  useEffect(() => {
    if (!selectedRegency) {
      setDistricts([]);
      return;
    }
    setLoading((p) => ({ ...p, districts: true }));
    supabase
      .from("districts")
      .select("id, name")
      .eq("regency_id", selectedRegency)
      .order("name")
      .then(({ data }) => {
        setDistricts(data ?? []);
        setLoading((p) => ({ ...p, districts: false }));
      });
  }, [supabase, selectedRegency]);

  // Fetch villages when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setVillages([]);
      return;
    }
    setLoading((p) => ({ ...p, villages: true }));
    supabase
      .from("villages")
      .select("id, name")
      .eq("district_id", selectedDistrict)
      .order("name")
      .then(({ data }) => {
        setVillages(data ?? []);
        setLoading((p) => ({ ...p, villages: false }));
      });
  }, [supabase, selectedDistrict]);

  // Sync external changes
  useEffect(() => {
    if (provinceId !== undefined) setSelectedProvince(provinceId);
  }, [provinceId]);
  useEffect(() => {
    if (regencyId !== undefined) setSelectedRegency(regencyId);
  }, [regencyId]);
  useEffect(() => {
    if (districtId !== undefined) setSelectedDistrict(districtId);
  }, [districtId]);
  useEffect(() => {
    if (villageId !== undefined) setSelectedVillage(villageId);
  }, [villageId]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    onProvinceChange?.(value);
    onChange?.("provinceId", value);
    if (value !== selectedProvince) {
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
      onRegencyChange?.("");
      onDistrictChange?.("");
      onVillageChange?.("");
      onChange?.("regencyId", "");
      onChange?.("districtId", "");
      onChange?.("villageId", "");
    }
  };

  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value);
    onRegencyChange?.(value);
    onChange?.("regencyId", value);
    if (value !== selectedRegency) {
      setSelectedDistrict("");
      setSelectedVillage("");
      onDistrictChange?.("");
      onVillageChange?.("");
      onChange?.("districtId", "");
      onChange?.("villageId", "");
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    onDistrictChange?.(value);
    onChange?.("districtId", value);
    if (value !== selectedDistrict) {
      setSelectedVillage("");
      onVillageChange?.("");
      onChange?.("villageId", "");
    }
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
    onVillageChange?.(value);
    onChange?.("villageId", value);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-pri-red" />
        <span className="text-xs text-pri-silver font-mono uppercase tracking-wider">
          Wilayah Domisili
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Province */}
        <NativeSelect
          label="Provinsi"
          value={selectedProvince}
          options={provinces}
          onChange={handleProvinceChange}
          placeholder="Pilih provinsi..."
          error={errors?.provinceId}
        />

        {/* Regency */}
        <NativeSelect
          label="Kota / Kabupaten"
          value={selectedRegency}
          options={regencies}
          onChange={handleRegencyChange}
          disabled={!selectedProvince}
          placeholder={selectedProvince ? "Pilih kota/kab..." : "Pilih provinsi dulu"}
          error={errors?.regencyId}
        />

        {/* District */}
        <NativeSelect
          label="Kecamatan"
          value={selectedDistrict}
          options={districts}
          onChange={handleDistrictChange}
          disabled={!selectedRegency}
          placeholder={selectedRegency ? "Pilih kecamatan..." : "Pilih kota dulu"}
          error={errors?.districtId}
        />

        {/* Village */}
        <NativeSelect
          label="Desa / Kelurahan"
          value={selectedVillage}
          options={villages}
          onChange={handleVillageChange}
          disabled={!selectedDistrict}
          placeholder={selectedDistrict ? "Pilih desa..." : "Pilih kecamatan dulu"}
          error={errors?.villageId}
        />
      </div>
      {/* Loading indicator */}
      {(loading.provinces || loading.regencies || loading.districts || loading.villages) && (
        <div className="flex items-center gap-2 text-xs text-pri-silver/60">
          <Loader2 className="h-3 w-3 animate-spin text-pri-red" />
          Memuat data wilayah...
        </div>
      )}
    </div>
  );
}
