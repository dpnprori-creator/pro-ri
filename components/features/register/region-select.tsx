"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Search, X, Loader2 } from "lucide-react";

interface Region {
  id: string;
  name: string;
}

interface LocationInputProps {
  label: string;
  value: string;
  placeholder: string;
  onSelect: (id: string) => void;
  onChange: (value: string) => void;
  fetchResults: (query: string) => Promise<Region[]>;
  disabled?: boolean;
  error?: string;
}

function LocationInput({
  label,
  value,
  placeholder,
  onSelect,
  onChange,
  fetchResults,
  disabled,
  error,
}: LocationInputProps) {
  const [query, setQuery] = useState(value ? "" : "");
  const [results, setResults] = useState<Region[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // When value (id) changes externally, clear selected label to force re-fetch
  useEffect(() => {
    if (!value) {
      setSelectedLabel("");
      setQuery("");
    }
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setQuery(q);
      onChange(q);
      setSelectedLabel("");
      if (q.length >= 1) {
        setIsOpen(true);
        // Debounce search
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
          setIsSearching(true);
          try {
            const data = await fetchResults(q);
            setResults(data);
          } catch {
            setResults([]);
          }
          setIsSearching(false);
        }, 200);
      } else {
        setIsOpen(false);
        setResults([]);
      }
    },
    [fetchResults, onChange]
  );

  const handleSelect = (item: Region) => {
    setSelectedLabel(item.name);
    setQuery(item.name);
    onSelect(item.id);
    onChange(item.id);
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setSelectedLabel("");
    onChange("");
    onSelect("");
    inputRef.current?.focus();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Show the name if we have a value but no label yet (load on mount)
  useEffect(() => {
    if (value && !selectedLabel && !query) {
      // Try to fetch the name from the DB
      fetchResults("").then((all) => {
        const found = all.find((r) => r.id === value);
        if (found) {
          setSelectedLabel(found.name);
          setQuery(found.name);
        }
      });
    }
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-pri-silver mb-1">
        {label}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-silver/50" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.length >= 1 || results.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-pri-navy border border-pri-gold/20 rounded-lg pl-9 pr-8 py-2 text-sm text-white placeholder:text-pri-silver/50 focus:outline-none focus:border-pri-red/50 transition-colors disabled:opacity-40"
          autoComplete="off"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pri-red animate-spin" />
        )}
        {!isSearching && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-pri-silver/50 hover:text-pri-silver transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown suggestions */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-1 w-full rounded-lg border border-white/10 bg-pri-navy shadow-xl max-h-48 overflow-y-auto"
        >
          {results.length === 0 && query.length >= 1 ? (
            <div className="px-3 py-2 text-xs text-pri-silver/50 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              {isSearching ? "Mencari..." : "Ketik untuk mencari..."}
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
              >
                <MapPin className="h-3.5 w-3.5 text-pri-silver/50 shrink-0" />
                {item.name}
              </button>
            ))
          )}
          {query.length >= 1 && results.length === 0 && !isSearching && (
            <div className="px-3 py-2 text-xs text-pri-silver/50 flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              Tidak ditemukan. Lanjutkan mengetik...
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
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

  const supabase = createClient();

  const [selectedProvince, setSelectedProvince] = useState(
    provinceId || defaultProvince || ""
  );
  const [selectedRegency, setSelectedRegency] = useState(
    regencyId || defaultRegency || ""
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    districtId || defaultDistrict || ""
  );
  const [selectedVillage, setSelectedVillage] = useState(
    villageId || defaultVillage || ""
  );

  // Cache Supabase responses to avoid repeated fetches on every keystroke
  const distCacheRef = useRef<Map<string, Region[]>>(new Map());
  const villageCacheRef = useRef<Map<string, Region[]>>(new Map());

  // Reset caches when parent selection changes
  useEffect(() => {
    distCacheRef.current.clear();
  }, [selectedRegency]);
  
  useEffect(() => {
    villageCacheRef.current.clear();
  }, [selectedDistrict]);

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

  // Handlers
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    onProvinceChange?.(value);
    onChange?.("provinceId", value);
    // Reset child selections
    if (value !== selectedProvince) {
      setSelectedRegency("");
      setSelectedDistrict("");
      setSelectedVillage("");
    }
  };

  const handleRegencyChange = (value: string) => {
    setSelectedRegency(value);
    onRegencyChange?.(value);
    onChange?.("regencyId", value);
    if (value !== selectedRegency) {
      setSelectedDistrict("");
      setSelectedVillage("");
    }
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    onDistrictChange?.(value);
    onChange?.("districtId", value);
    if (value !== selectedDistrict) {
      setSelectedVillage("");
    }
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
    onVillageChange?.(value);
    onChange?.("villageId", value);
  };

  // Data fetching functions
  const fetchProvinces = useCallback(
    async (query: string) => {
      const { data } = await supabase
        .from("provinces")
        .select("id, name")
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(10);
      return (data ?? []) as Region[];
    },
    [supabase]
  );

  const fetchRegencies = useCallback(
    async (query: string) => {
      if (!selectedProvince) return [];
      const { data } = await supabase
        .from("regencies")
        .select("id, name")
        .eq("province_id", selectedProvince)
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(10);
      return (data ?? []) as Region[];
    },
    [supabase, selectedProvince]
  );

  const fetchDistricts = useCallback(
    async (query: string) => {
      if (!selectedRegency) return [];

      const cacheKey = `districts-${selectedRegency}`;
      const cached = distCacheRef.current.get(cacheKey);

      if (cached) {
        return cached
          .filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
      }

      // Fetch from Supabase
      const { data } = await supabase
        .from("districts")
        .select("id, name")
        .eq("regency_id", selectedRegency)
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(10);

      const mapped = (data ?? []) as Region[];
      distCacheRef.current.set(cacheKey, mapped);

      return mapped;
    },
    [supabase, selectedRegency]
  );

  const fetchVillages = useCallback(
    async (query: string) => {
      if (!selectedDistrict) return [];

      const cacheKey = `villages-${selectedDistrict}`;
      const cached = villageCacheRef.current.get(cacheKey);

      if (cached) {
        return cached
          .filter((v) => v.name.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 10);
      }

      // Fetch from Supabase
      const { data } = await supabase
        .from("villages")
        .select("id, name")
        .eq("district_id", selectedDistrict)
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(10);

      const mapped = (data ?? []) as Region[];
      villageCacheRef.current.set(cacheKey, mapped);

      return mapped;
    },
    [supabase, selectedDistrict]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-4 w-4 text-pri-red" />
        <span className="text-xs text-pri-silver font-mono uppercase tracking-wider">
          Wilayah Domisili
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <LocationInput
          label="Provinsi"
          value={selectedProvince}
          placeholder="Ketik nama provinsi..."
          onSelect={(id) => {
            setSelectedProvince(id);
            onProvinceChange?.(id);
            onChange?.("provinceId", id);
            setSelectedRegency("");
            setSelectedDistrict("");
            setSelectedVillage("");
          }}
          onChange={() => {}}
          fetchResults={fetchProvinces}
          error={errors?.provinceId}
        />

        <LocationInput
          label="Kota / Kabupaten"
          value={selectedRegency}
          placeholder={
            selectedProvince ? "Ketik nama kota..." : "Pilih provinsi dulu"
          }
          onSelect={(id) => {
            setSelectedRegency(id);
            onRegencyChange?.(id);
            onChange?.("regencyId", id);
            setSelectedDistrict("");
            setSelectedVillage("");
          }}
          onChange={() => {}}
          fetchResults={fetchRegencies}
          disabled={!selectedProvince}
          error={errors?.regencyId}
        />

        <LocationInput
          label="Kecamatan"
          value={selectedDistrict}
          placeholder={
            selectedRegency ? "Ketik nama kecamatan..." : "Pilih kota dulu"
          }
          onSelect={(id) => {
            setSelectedDistrict(id);
            onDistrictChange?.(id);
            onChange?.("districtId", id);
            setSelectedVillage("");
          }}
          onChange={() => {}}
          fetchResults={fetchDistricts}
          disabled={!selectedRegency}
          error={errors?.districtId}
        />

        <LocationInput
          label="Desa / Kelurahan"
          value={selectedVillage}
          placeholder={
            selectedDistrict
              ? "Ketik nama desa..."
              : "Pilih kecamatan dulu"
          }
          onSelect={(id) => {
            setSelectedVillage(id);
            onVillageChange?.(id);
            onChange?.("villageId", id);
          }}
          onChange={() => {}}
          fetchResults={fetchVillages}
          disabled={!selectedDistrict}
        />
      </div>
    </div>
  );
}
