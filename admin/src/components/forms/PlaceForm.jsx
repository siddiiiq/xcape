import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUploader from "./ImageUploader.jsx";
import GalleryManager from "./GalleryManager.jsx";
import TagInput from "./TagInput.jsx";
import { useToast } from "../common/Toast.jsx";
import {
  createPlace,
  updatePlace,
  uploadPlaceCover,
  uploadPlaceGallery,
  updatePlaceImage,
  reorderPlaceImages,
  deletePlaceImage,
} from "../../api/placesApi.js";

const emptyPlace = {
  title: "",
  location: "",
  shortDescription: "",
  story: "",
  instagramUrl: "",
  tags: [],
  coordinates: {
    lat: "",
    lng: "",
  },
  published: false,
  featured: false,
  order: 0,
  coverImage: null,
  gallery: [],
};

const PlaceForm = ({ existingPlace, placeId }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [place, setPlace] = useState(existingPlace || emptyPlace);
  const [saving, setSaving] = useState(false);
  const [id, setId] = useState(placeId || null);

  useEffect(() => {
    if (existingPlace) {
      setPlace(existingPlace);
    }
  }, [existingPlace]);

  const update = (patch) => {
    setPlace((current) => ({
      ...current,
      ...patch,
    }));
  };

  const updateCoordinates = (key, value) => {
    setPlace((current) => ({
      ...current,
      coordinates: {
        ...current.coordinates,
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!place.title?.trim()) {
      showToast("Title is required", "error");
      return;
    }

    setSaving(true);

    try {
      if (id) {
        const res = await updatePlace(id, place);

        setPlace(res.place);
        showToast("Place saved");
      } else {
        const res = await createPlace(place);

        setId(res.place._id);
        setPlace(res.place);

        showToast("Place created");

        navigate(`/admin/places/${res.place._id}/edit`, {
          replace: true,
        });
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to save",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* =========================================================
          TOP SECTION
      ========================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">

        {/* =====================================================
            LEFT - MAIN INFORMATION
        ====================================================== */}
        <div className="min-w-0 space-y-6">

          {/* BASIC INFORMATION */}
          <section className="card p-4 sm:p-6">
            <div className="mb-5">
              <p className="text-base font-semibold">
                Basic Information
              </p>

              <p className="mt-1 text-xs text-muted sm:text-sm">
                Add the basic details and story of this place.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* NAME */}
              <div className="sm:col-span-2">
                <label className="label">
                  Name
                </label>

                <input
                  type="text"
                  className="input w-full"
                  placeholder="Enter place name"
                  value={place.title || ""}
                  onChange={(e) =>
                    update({
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {/* LOCATION */}
              <div className="sm:col-span-2">
                <label className="label">
                  Location
                </label>

                <input
                  type="text"
                  className="input w-full"
                  placeholder="e.g. Mangalore, Karnataka"
                  value={place.location || ""}
                  onChange={(e) =>
                    update({
                      location: e.target.value,
                    })
                  }
                />
              </div>

              {/* SHORT DESCRIPTION */}
              <div className="sm:col-span-2">
                <label className="label">
                  Short Description
                </label>

                <textarea
                  rows={3}
                  className="input w-full resize-y"
                  placeholder="A short description that appears on cards and previews..."
                  value={place.shortDescription || ""}
                  onChange={(e) =>
                    update({
                      shortDescription: e.target.value,
                    })
                  }
                />
              </div>

              {/* FULL STORY */}
              <div className="sm:col-span-2">
                <label className="label">
                  Full Story
                </label>

                <textarea
                  rows={8}
                  className="input w-full resize-y"
                  placeholder="Tell the full story of this place..."
                  value={place.story || ""}
                  onChange={(e) =>
                    update({
                      story: e.target.value,
                    })
                  }
                />
              </div>

              {/* INSTAGRAM */}
              <div className="sm:col-span-2">
                <label className="label">
                  Instagram URL
                </label>

                <p className="mb-2 text-xs text-muted">
                  Add the Instagram post or reel related to this place.
                </p>

                <input
                  type="url"
                  className="input w-full"
                  placeholder="https://www.instagram.com/p/..."
                  value={place.instagramUrl || ""}
                  onChange={(e) =>
                    update({
                      instagramUrl: e.target.value,
                    })
                  }
                />
              </div>

              {/* TAGS */}
              <div className="sm:col-span-2">
                <label className="label">
                  Tags
                </label>

                <TagInput
                  value={place.tags || []}
                  onChange={(tags) =>
                    update({
                      tags,
                    })
                  }
                />
              </div>

              {/* COORDINATES */}
              <div>
                <label className="label">
                  Latitude
                </label>

                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="input w-full"
                  placeholder="12.9141"
                  value={place.coordinates?.lat ?? ""}
                  onChange={(e) =>
                    updateCoordinates(
                      "lat",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <label className="label">
                  Longitude
                </label>

                <input
                  type="number"
                  step="any"
                  inputMode="decimal"
                  className="input w-full"
                  placeholder="74.8560"
                  value={place.coordinates?.lng ?? ""}
                  onChange={(e) =>
                    updateCoordinates(
                      "lng",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* ===================================================
              COVER IMAGE
          ==================================================== */}
          <section className="card p-4 sm:p-6">
            <div className="mb-5">
              <p className="text-base font-semibold">
                Cover Image
              </p>

              <p className="mt-1 text-xs text-muted sm:text-sm">
                This image will be used as the main image for the place.
              </p>
            </div>

            {!id ? (
              <div className="rounded-xl border border-dashed p-5 text-center sm:p-8">
                <p className="text-sm text-muted">
                  Save the place first, then upload a cover image.
                </p>
              </div>
            ) : (
              <div className="w-full">
                <ImageUploader
                  currentUrl={place.coverImage?.url}
                  onUpload={async (file) => {
                    const res = await uploadPlaceCover(
                      id,
                      file
                    );

                    update({
                      coverImage: res.coverImage,
                    });

                    showToast("Cover image updated");
                  }}
                />
              </div>
            )}
          </section>
        </div>

        {/* =====================================================
            RIGHT - PUBLISHING
        ====================================================== */}
        <aside className="min-w-0">
          <section className="card p-4 sm:p-6 lg:sticky lg:top-6">

            <div className="mb-5">
              <p className="text-base font-semibold">
                Publishing
              </p>

              <p className="mt-1 text-xs text-muted">
                Control how this place appears on the website.
              </p>
            </div>

            {/* PUBLISHED */}
            <label className="mb-4 flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3">
              <div>
                <p className="text-sm font-medium">
                  Published
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  Show this place publicly
                </p>
              </div>

              <input
                type="checkbox"
                checked={Boolean(place.published)}
                onChange={(e) =>
                  update({
                    published: e.target.checked,
                  })
                }
                className="h-5 w-5 shrink-0"
              />
            </label>

            {/* FEATURED */}
            <label className="mb-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border p-3">
              <div>
                <p className="text-sm font-medium">
                  Featured
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  Highlight this place
                </p>
              </div>

              <input
                type="checkbox"
                checked={Boolean(place.featured)}
                onChange={(e) =>
                  update({
                    featured: e.target.checked,
                  })
                }
                className="h-5 w-5 shrink-0"
              />
            </label>

            {/* DISPLAY ORDER */}
            <div className="mb-5">
              <label className="label">
                Display Order
              </label>

              <input
                type="number"
                inputMode="numeric"
                className="input w-full"
                value={place.order ?? 0}
                onChange={(e) =>
                  update({
                    order: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* SAVE */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="btn-primary w-full"
            >
              {saving
                ? "Saving..."
                : id
                ? "Save Place"
                : "Create Place"}
            </button>
          </section>
        </aside>
      </div>

      {/* =========================================================
          GALLERY - FULL WIDTH
      ========================================================== */}
      <section className="card w-full min-w-0 overflow-hidden p-4 sm:p-6">

        {/* HEADER */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-base font-semibold">
              Gallery
            </p>

            <p className="mt-1 text-xs text-muted sm:text-sm">
              Upload, reorder, edit, or delete images for this place.
            </p>
          </div>

          {id && place.gallery?.length > 0 && (
            <div className="w-fit rounded-full border px-3 py-1 text-xs text-muted">
              {place.gallery.length}{" "}
              {place.gallery.length === 1
                ? "image"
                : "images"}
            </div>
          )}
        </div>

        {!id ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed p-6 text-center sm:min-h-[240px]">
            <div>
              <p className="text-sm font-medium">
                Save the place first
              </p>

              <p className="mt-1 text-xs text-muted sm:text-sm">
                Once the place is saved, you'll be able to
                upload and manage gallery images.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full min-w-0">

            <GalleryManager
              images={place.gallery || []}

              /* ================================
                 UPLOAD
              ================================= */
              onUpload={async (files) => {
                if (!files?.length) return;

                const res =
                  await uploadPlaceGallery(
                    id,
                    files
                  );

                update({
                  gallery: res.gallery,
                });

                showToast(
                  `${files.length} image${
                    files.length === 1 ? "" : "s"
                  } uploaded`
                );
              }}

              /* ================================
                 UPDATE IMAGE
              ================================= */
              onUpdateImage={async (
                imageId,
                patch
              ) => {
                update({
                  gallery: (place.gallery || []).map(
                    (img) =>
                      img._id === imageId
                        ? {
                            ...img,
                            ...patch,
                          }
                        : img
                  ),
                });

                try {
                  await updatePlaceImage(
                    id,
                    imageId,
                    patch
                  );
                } catch (err) {
                  showToast(
                    err.response?.data?.message ||
                      "Failed to update image",
                    "error"
                  );
                }
              }}

              /* ================================
                 REORDER
              ================================= */
              onReorder={async (orderIds) => {
                const res =
                  await reorderPlaceImages(
                    id,
                    orderIds
                  );

                update({
                  gallery: res.gallery,
                });
              }}

              /* ================================
                 SET COVER
              ================================= */
              onSetCover={async (image) => {
                try {
                  await updatePlaceImage(
                    id,
                    image._id,
                    {
                      setAsCover: true,
                    }
                  );

                  update({
                    coverImage: {
                      url: image.url,
                      publicId: image.publicId,
                    },
                  });

                  showToast(
                    "Cover image updated"
                  );
                } catch (err) {
                  showToast(
                    err.response?.data?.message ||
                      "Failed to set cover image",
                    "error"
                  );
                }
              }}

              /* ================================
                 DELETE
              ================================= */
              onDelete={async (imageId) => {
                const res =
                  await deletePlaceImage(
                    id,
                    imageId
                  );

                update({
                  gallery: res.gallery,
                });

                showToast("Image deleted");
              }}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default PlaceForm;