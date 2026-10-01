---
name: DogAdopt
description: A friendly adoption noticeboard for a portfolio demo.
colors:
  apricot-orange: "#FF914D"
  apricot-pressed: "#e47633"
  paw-red-orange: "#f5592c"
  paw-golden-orange: "#fb8c34"
  shelter-green: "#37986e"
  warm-cream: "#F6F2ED"
  light-cream: "#F9F5EF"
  ink: "#1F2937"
  muted-gray: "#6B7280"
  outline: "#262626"
  white: "#ffffff"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
    fontSize: "3.6vw"
    fontWeight: 900
    lineHeight: "1.1"
  headline:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
    fontSize: "2.4vw"
    fontWeight: 900
    lineHeight: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
    fontSize: "1.3vw"
    fontWeight: 700
    lineHeight: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
    fontSize: "1.1vw"
    fontWeight: 400
    lineHeight: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial"
    fontSize: "1.1vw"
    fontWeight: 800
    lineHeight: "normal"
rounded:
  field: "0.8vw"
  card: "1.1vw"
  panel: "1.4vw"
  circle: "50%"
spacing:
  action-gap: "1vw"
  card-gap: "2vw"
  page-gutter: "4vw"
  section-block: "6vh"
components:
  button-primary:
    backgroundColor: "{colors.apricot-orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.card}"
    padding: "1.6vh 1.8vw"
  button-primary-active:
    backgroundColor: "{colors.apricot-pressed}"
  button-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.6vh 1.8vw"
  button-ghost:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "1.6vh 1.8vw"
  story-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "3vh 1.6vw"
  form-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "1.5vh 1.5vw"
---

# Design System: DogAdopt

## Overview

**Creative North Star: "Friendly adoption noticeboard"**

Warm, playful, and approachable. Cream backgrounds and orange actions support a community noticeboard character. Bold outlines, rounded corners, and paw motifs connect the pages.

This document records the current implementation, including its limitations. PRODUCT.md records the confirmed demo context. It does not establish new product claims or redesign the interface.

Key characteristics:

- Cream page surfaces with orange actions and green paw accents.
- Heavy dark outlines, rounded cards, and hard offset shadows.
- Bold system typography and short groups of information.

## Colors

Apricot orange is the primary action color; its pressed variant darkens on activation. Red-orange and golden-orange support paw motifs, with shelter green as the contrasting accent. Warm cream fills the page, light cream separates headers and alternate sections, and white fills cards and secondary controls. Ink carries headings and body text; muted gray carries supporting copy. The outline color supplies borders and offset shadows.

Frontmatter values are the extracted source values. White on apricot orange and muted gray on warm cream have known contrast defects; their presence here records the current implementation rather than approving their accessibility.

## Typography

The About page uses the system sans-serif stack recorded above. Global styles add Helvetica Neue and Noto Sans fallbacks. Display and section headings are heavy, navigation and buttons are bold, and supporting text is regular.

The frontmatter scale describes About: display title, section headline, person-name title, supporting body copy, and navigation label. The global body defaults to 16px. Home's hero uses 3.8vw rather than About's 3.6vw. Standard buttons use 1.2vw at weight 800; large buttons use 1.4vw. Most text has browser-normal line height. These viewport sizes currently lack a usable lower bound on About.

## Layout

Public-page containers occupy 92vw with 4vw side margins. Headers use a four-column grid for brand, navigation, account actions, and the hidden menu control. About's hero is a two-column flex layout, followed by three story cards and four team cards. Content sections use vertical spacing tied to viewport height.

About and Home have no dedicated small-screen breakpoint. Authentication has a 420px adjustment; adoption and contact have 768px adjustments. The latter hide navigation and show menu buttons, but this is not evidence of complete mobile menu behavior. Capture these as existing boundaries, not a responsive system to reuse unchanged.

## Elevation & Depth

Shadows are structural: their hard offsets make cards and controls read as raised objects. Cream section changes provide an additional layer without soft ambient blur.

The recurring card/button shadow is .35vw .35vw 0 in the outline color. Button hover lifts by -.15vw on each axis and increases the offset to .4vw; pressing reduces it to .25vw. These states transition over .12s ease. Authentication fields use .15s transitions and an orange focus ring. There is no general reduced-motion rule.

## Shapes

Cards and public-page buttons share rounded corners. The statistics panel is slightly rounder, fields have tighter corners, and paw badges are circular. Dark borders are typically .26vw; fields use .2vw and authentication controls use .25vw. Corners, borders, and shadows scale with viewport width in the current code.

## Components

Tactile and playful. The same outlined, raised treatment connects actions and information containers.

- Primary buttons have orange fill, white bold text, a dark border, and a hard shadow. Outline and ghost variants both use white fill and dark text. Hover and pressed states are explicit; no custom focus-visible rule exists for public-page buttons.
- Story cards use white fill, dark borders, and the shared shadow. Alternate sections and the statistics panel use light cream.
- Contact/adoption fields have visible labels, white fill, and dark borders. Authentication fields add a hard shadow and an explicit orange focus ring. Distinct error and disabled designs are not implemented.
- Navigation uses bold text, a dark hover underline, and a golden-orange active underline. About's active link is visual only; aria-current is absent.
- Paw badges use three accent colors and circular outlines. Current footer social badges are inert spans, not working social links.
- Team cards contain named portraits and role text. The renderer uses img elements, but media CSS assumes a background image. Image containment is a known defect and must not become a component convention.

Component examples in the sidecar reproduce the existing visual primitives. Browser-default focus outlines remain available in interactive previews. They do not claim that unfinished application flows are functional.

## Do's and Don'ts

- Do retain the shared palette and outline language when extending the current design.
- Do distinguish the orange primary action from white secondary actions.
- Do use semantic headings and named image alternatives, as the team renderer does.
- Don't treat placeholder profiles or statistics as verified evidence.
- Don't copy the known image overflow, tiny mobile typography, or low-contrast combinations into new work.
- Don't describe absent responsive or interaction states as implemented.
