@echo off
echo Creating images\events directory if it doesn't exist...
mkdir "d:\Testing\Project\images\events" 2>nul

echo Copying images...
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\golden_king_event_1783089448233.png" "d:\Testing\Project\images\events\golden_king.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\papyrus_workshop_1783089484502.png" "d:\Testing\Project\images\events\papyrus_workshop.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\sphinx_light_show_1783089496331.png" "d:\Testing\Project\images\events\sphinx_light_show.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\ramses_legacy_1783089508387.png" "d:\Testing\Project\images\events\ramses_legacy.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\hieroglyphs_101_1783089530701.png" "d:\Testing\Project\images\events\hieroglyphs.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\nile_jazz_1783089541391.png" "d:\Testing\Project\images\events\nile_jazz.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\grand_discovery_1783089551729.png" "d:\Testing\Project\images\events\grand_discovery.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\board_games_1783089572288.png" "d:\Testing\Project\images\events\board_games.png" /Y
copy "C:\Users\AT\.gemini\antigravity-ide\brain\c2b8494f-f5dc-443e-beac-66e0169b001c\sunrise_yoga_1783089582233.png" "d:\Testing\Project\images\events\sunrise_yoga.png" /Y

echo Done! Images have been copied successfully.
pause
