--[[
LaTeX cannot include the SVG and GIF images used on the website: pandoc emits
\includesvg for SVGs (which needs Inkscape at compile time), and xelatex cannot
read GIFs at all. Here we convert them to PDF and PNG respectively, in both
cases using R, and rewrite the image paths to point at the converted files.
]]

local cache_dir = "_latex-images"

-- R expression converting `src` to `dest`, per source extension.
local converters = {
  svg = function(src, dest)
    return string.format('rsvg::rsvg_pdf("%s", "%s")', src, dest)
  end,
  -- Only the first frame of an animation can be shown on paper.
  gif = function(src, dest)
    return string.format(
      'magick::image_write(magick::image_read("%s")[1], "%s", format = "png")', src, dest
    )
  end
}

local new_extension = { svg = "pdf", gif = "png" }

local function source_extension(src)
  if src:match("^%a+://") then
    return nil
  end
  local ext = src:match("%.(%a+)$")
  return converters[ext] and ext or nil
end

local function converted_path(src, ext)
  return cache_dir .. "/" .. src:gsub("%.%a+$", "." .. new_extension[ext])
end

local function is_up_to_date(src, dest)
  return os.execute(string.format("[ %q -nt %q ]", dest, src)) and true or false
end

local function convert(pending)
  local calls = {}
  for _, item in ipairs(pending) do
    os.execute(string.format("mkdir -p %q", item.dest:gsub("/[^/]*$", "")))
    calls[#calls + 1] = converters[item.ext](item.src, item.dest)
  end
  if not os.execute(string.format("Rscript -e '%s'", table.concat(calls, "; "))) then
    error("failed to convert images for LaTeX output")
  end
end

function Pandoc(doc)
  local pending, seen = {}, {}
  doc:walk {
    Image = function(el)
      local ext = source_extension(el.src)
      if ext and not seen[el.src] then
        seen[el.src] = true
        local dest = converted_path(el.src, ext)
        if not is_up_to_date(el.src, dest) then
          pending[#pending + 1] = { src = el.src, dest = dest, ext = ext }
        end
      end
    end
  }
  if #pending > 0 then
    convert(pending)
  end
  return doc:walk {
    Image = function(el)
      local ext = source_extension(el.src)
      if ext then
        el.src = converted_path(el.src, ext)
        return el
      end
    end
  }
end
