"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Pencil, Upload } from "lucide-react";

type Brand = {
  id: number;
  name: string;
  statement: string;
  description?: string;
  logo?: string;
  createdAt: Date;
};

const Brandspace = () => {
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [editableBrand, setEditableBrand] = useState<Brand | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 8,
      name: "Brand Eight",
      statement: "Pioneering Solutions",
      description: "Description of Brand Eight",
      createdAt: new Date("2024-03-08"),
    },
    {
      id: 11,
      name: "Brand Eleven",
      statement: "Advancing Technologies",
      description: "Description of Brand Eleven",
      createdAt: new Date("2024-03-18"),
    },
    {
      id: 5,
      name: "Brand Five",
      statement: "Empowering Change",
      description: "Description of Brand Five",
      createdAt: new Date("2024-03-15"),
    },
    {
      id: 4,
      name: "Brand Four",
      statement: "Shaping the Future",
      description: "Description of Brand Four",
      createdAt: new Date("2024-03-10"),
    },
    {
      id: 9,
      name: "Brand Nine",
      statement: "Creating Possibilities",
      description: "Description of Brand Nine",
      createdAt: new Date("2024-03-12"),
    },
  ]);

  const filteredBrands = brands
    .filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "created-newest")
        return b.createdAt.getTime() - a.createdAt.getTime();
      if (sortBy === "created-oldest")
        return a.createdAt.getTime() - b.createdAt.getTime();
      return 0;
    });

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setEditableBrand({ ...brand });
    setIsEditing(false);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editableBrand) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditableBrand({ ...editableBrand, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    if (!editableBrand) return;
    setBrands((prev) =>
      prev.map((b) => (b.id === editableBrand.id ? editableBrand : b))
    );
    setSelectedBrand(editableBrand);
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {selectedBrand ? (
        <div className="p-6 bg-white border rounded-lg shadow-sm w-full">
          <Button
            className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => setSelectedBrand(null)}
          >
            Back
          </Button>

          <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
              {editableBrand?.logo ? (
                <img
                  src={editableBrand.logo}
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  Logo
                </div>
              )}
            </div>

            {!isEditing ? (
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold text-blue-600">
                  {selectedBrand.name}
                </h2>
                <p className="text-gray-700">{selectedBrand.statement}</p>
                {selectedBrand.description && (
                  <p className="text-sm text-gray-500">
                    {selectedBrand.description}
                  </p>
                )}

                <Button
                  className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setIsEditing(true);
                    setEditableBrand({ ...selectedBrand });
                  }}
                >
                  <Pencil size={16} className="mr-2" /> Edit
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <div>
                  <label className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                    <Upload size={16} /> Upload Logo
                  </label>
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} />
                </div>

                <Input
                  placeholder="Brand Name"
                  value={editableBrand?.name || ""}
                  onChange={(e) =>
                    setEditableBrand(
                      (prev) => prev && { ...prev, name: e.target.value }
                    )
                  }
                />

                <Input
                  placeholder="Brand Statement"
                  value={editableBrand?.statement || ""}
                  onChange={(e) =>
                    setEditableBrand(
                      (prev) => prev && { ...prev, statement: e.target.value }
                    )
                  }
                />

                <Input
                  placeholder="Brand Description"
                  value={editableBrand?.description || ""}
                  onChange={(e) =>
                    setEditableBrand(
                      (prev) => prev && { ...prev, description: e.target.value }
                    )
                  }
                />

                <Button
                  className="bg-green-600 text-white w-full"
                  onClick={handleSaveChanges}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex gap-4 items-center">
            <Input
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
            <Select onValueChange={setSortBy}>
              <SelectTrigger>Sort by</SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="created-newest">Newest</SelectItem>
                <SelectItem value="created-oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[500px] overflow-y-auto space-y-4">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleSelectBrand(brand)}
                className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:border-blue-500 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt="Brand Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-600">{brand.name}</h3>
                    <p className="text-gray-600 text-sm">{brand.statement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Brandspace;
