"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  const [selectedProvince, setSelectedProvince] = useState(provinceId || defaultProvince || "");
  const [selectedRegency, setSelectedRegency] = useState(regencyId || defaultRegency || "");
  const [selectedDistrict, setSelectedDistrict] = useState(districtId || defaultDistrict || "");
  const [selectedVillage, setSelectedVillage] = useState(villageId || defaultVillage || "");

  const supabase = createClient();

  // Sync external provinceId changes
  useEffect(() => {
    if (provinceId !== undefined && provinceId !== selectedProvince) {
      setSelectedProvince(provinceId);
    }
  }, [provinceId]);

  useEffect(() => {
    if (regencyId !== undefined && regencyId !== selectedRegency) {
      setSelectedRegency(regencyId);
    }
  }, [regencyId]);

  useEffect(() => {
    supabase.from("provinces").select("id, name").order("name").then(({ data }) => {
      if (data) setProvinces(data);
    });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      supabase.from("regencies").select("id, name").eq("province_id", selectedProvince).order("name").then(({ data }) => {
        if (data) setRegencies(data);
      });
      if (!regencyId) {
        setSelectedRegency("");
        setSelectedDistrict("");
        setSelectedVillage("");
      }
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      supabase.from("districts").select("id, name").eq("regency_id", selectedRegency).order("name").then(({ data }) => {
        if (data) setDistricts(data);
      });
      if (!districtId) {
        setSelectedDistrict("");
        setSelectedVillage("");
      }
    }
  }, [selectedRegency]);

  useEffect(() => {
    if (selectedDistrict) {
      supabase.from("villages").select("id, name").eq("district_id", selectedDistrict).order("name").then(({ data }) => {
        if (data) setVillages(data);
      });
      if (!villageId) {
        setSelectedVillage("");
      }
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    onProvinceChange?.(value);
    onChange?.("provinceId", value);
  };

  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value);
    onRegencyChange?.(value);
    onChange?.("regencyId", value);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    onDistrictChange?.(value);
    onChange?.("districtId", value);
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
    onVillageChange?.(value);
    onChange?.("villageId", value);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-pri-silver mb-1">Provinsi</label>
        <select
          className="w-full bg-pri-navy border border-pri-gold/20 rounded-lg px-3 py-2 text-white"
          value={selectedProvince}
          onChange={(e) => handleProvinceChange(e.target.value)}
        >
          <option value="">Pilih Provinsi</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        {errors?.provinceId && <p className="text-xs text-red-400 mt-1">{errors.provinceId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-pri-silver mb-1">Kota/Kabupaten</label>
        <select
          className="w-full bg-pri-navy border border-pri-gold/20 rounded-lg px-3 py-2 text-white"
          value={selectedRegency}
          onChange={(e) => handleRegencyChange(e.target.value)}
          disabled={!selectedProvince}
        >
          <option value="">Pilih Kota/Kabupaten</option>
          {regencies.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
        {errors?.regencyId && <p className="text-xs text-red-400 mt-1">{errors.regencyId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-pri-silver mb-1">Kecamatan</label>
        <select
          className="w-full bg-pri-navy border border-pri-gold/20 rounded-lg px-3 py-2 text-white"
          value={selectedDistrict}
          onChange={(e) => handleDistrictChange(e.target.value)}
          disabled={!selectedRegency}
        >
          <option value="">Pilih Kecamatan</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        {errors?.districtId && <p className="text-xs text-red-400 mt-1">{errors.districtId}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-pri-silver mb-1">Desa/Kelurahan</label>
        <select
          className="w-full bg-pri-navy border border-pri-gold/20 rounded-lg px-3 py-2 text-white"
          value={selectedVillage}
          onChange={(e) => handleVillageChange(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Pilih Desa/Kelurahan</option>
          {villages.map((v) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
