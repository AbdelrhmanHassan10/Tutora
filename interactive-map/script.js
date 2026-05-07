/* ═══ GEM DIGITAL TWIN v7.0 — THREE.JS ENGINE ═══ */
document.addEventListener('DOMContentLoaded', () => {
    // === DOM ===
    const container = document.getElementById('canvas-container');
    const complexMap = document.getElementById('complex-map-container');
    const gemMap = document.getElementById('gem-map');
    const hallPopup = document.getElementById('hall-popup');
    const legendItems = document.getElementById('legend-items');
    const complexLegend = document.getElementById('complex-sidebar-legend');
    const floorSwitcher = document.getElementById('floor-switcher');
    const loadBar = document.getElementById('loadBar');
    const loadText = document.getElementById('loadText');
    const loadScreen = document.getElementById('loading-screen');
    const viewTabs = document.querySelectorAll('.view-tab');
    const levelBtns = document.querySelectorAll('.level-btn');

    let viewMode = 'complex', currentLevel = 'L2';
    let scene, camera, renderer, controls, raycaster, mouse;
    let hallMeshes = [], dustParticles, clock;
    let animId, isThreeReady = false;

    // === LOADING ===
    const setLoad = (pct, msg) => { loadBar.style.width = pct + '%'; loadText.textContent = msg; };

    // === INIT ===
    const init = () => {
        setLoad(10, 'LOADING COMPLEX MAP...');
        renderComplex();
        setLoad(40, 'INITIALIZING 3D ENGINE...');
        initThree();
        setLoad(70, 'BUILDING MUSEUM GEOMETRY...');
        buildMuseum();
        setLoad(90, 'ADDING ATMOSPHERE...');
        addLighting();
        addParticles();
        setLoad(100, 'SYSTEM READY');
        setTimeout(() => loadScreen.classList.add('fade-out'), 800);
        setupEvents();
        updateLegend();
        animate();
    };

    // === THREE.JS SETUP ===
    const initThree = () => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x060a0f);
        scene.fog = new THREE.FogExp2(0x060a0f, 0.004);

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 80, 120);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        clock = new THREE.Clock();

        // Simple orbit via mouse
        let isDrag = false, prevX = 0, prevY = 0, theta = 0.5, phi = 0.7, radius = 140;
        const updateOrbit = () => {
            camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
            camera.position.y = radius * Math.cos(phi);
            camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
            camera.lookAt(0, 5, 0);
        };

        renderer.domElement.addEventListener('mousedown', e => { isDrag = true; prevX = e.clientX; prevY = e.clientY; });
        window.addEventListener('mousemove', e => {
            if (!isDrag || viewMode !== 'interior') return;
            theta += (e.clientX - prevX) * 0.005;
            phi = Math.max(0.2, Math.min(1.5, phi - (e.clientY - prevY) * 0.005));
            prevX = e.clientX; prevY = e.clientY;
            updateOrbit();
        });
        window.addEventListener('mouseup', () => isDrag = false);
        renderer.domElement.addEventListener('wheel', e => {
            if (viewMode !== 'interior') return;
            radius = Math.max(20, Math.min(150, radius + e.deltaY * 0.05));
            updateOrbit();
        });

        // Click detection
        renderer.domElement.addEventListener('click', e => {
            if (viewMode !== 'interior') return;
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const hits = raycaster.intersectObjects(hallMeshes);
            if (hits.length > 0 && hits[0].object.userData.hall) {
                openHall(hits[0].object.userData.hall);
            }
        });

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        isThreeReady = true;
    };

    // === MATERIALS ===
    const mat = {
        floor: () => new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.2, metalness: 0.1 }),
        wall: () => new THREE.MeshStandardMaterial({ color: 0xd4c9b0, roughness: 0.6, metalness: 0.0 }),
        ceiling: () => new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8, metalness: 0.0 }),
        gold: () => new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.8, emissive: 0x3a2a00, emissiveIntensity: 0.2 }),
        glass: () => new THREE.MeshPhysicalMaterial({ color: 0x88ccff, roughness: 0.05, metalness: 0.0, transmission: 0.8, thickness: 0.2, transparent: true, opacity: 0.3 }),
        column: () => new THREE.MeshStandardMaterial({ color: 0x8d7b68, roughness: 0.4, metalness: 0.05 }),
        hallBox: (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.1, emissive: c, emissiveIntensity: 0.05 }),
    };

    // === BUILD MUSEUM ===
    const buildMuseum = () => {
        // --- GRAND MARBLE FLOOR ---
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 160), mat.floor());
        floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
        // Marble tile lines
        for (let i = -100; i <= 100; i += 5) {
            const lineGeo = new THREE.BoxGeometry(200, 0.02, 0.05);
            const lineM = new THREE.Mesh(lineGeo, new THREE.MeshBasicMaterial({ color: 0xc8b896 }));
            lineM.position.set(0, 0.01, i); scene.add(lineM);
            const lineM2 = lineM.clone(); lineM2.rotation.y = Math.PI/2; lineM2.position.set(i, 0.01, 0); scene.add(lineM2);
        }

        // --- OUTER WALLS (huge museum shell) ---
        const wallMat = mat.wall();
        const addWall = (w,h,x,y,z,ry=0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,0.8), wallMat); m.position.set(x,y,z); m.rotation.y=ry; m.castShadow=true; m.receiveShadow=true; scene.add(m); };
        addWall(200,20,0,10,-80); addWall(200,20,0,10,80); addWall(160,20,-100,10,0,Math.PI/2); addWall(160,20,100,10,0,Math.PI/2);

        // --- CEILING with skylights ---
        const ceilMat = new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.9 });
        const ceil = new THREE.Mesh(new THREE.PlaneGeometry(200,160), ceilMat);
        ceil.rotation.x = Math.PI/2; ceil.position.y = 20; scene.add(ceil);
        for (let x = -60; x <= 60; x += 30) {
            const sky = new THREE.Mesh(new THREE.PlaneGeometry(12, 100), mat.glass());
            sky.rotation.x = Math.PI/2; sky.position.set(x, 19.9, 0); scene.add(sky);
        }

        // --- GRAND STAIRCASE (center) ---
        const stairMat = new THREE.MeshStandardMaterial({ color: 0xc2a878, roughness: 0.3, metalness: 0.05 });
        for (let i = 0; i < 30; i++) {
            const step = new THREE.Mesh(new THREE.BoxGeometry(18, 0.35, 1.8), stairMat);
            step.position.set(0, i*0.35, -60 + i*2); step.castShadow = true; scene.add(step);
            // Gold railing dots
            if (i % 3 === 0) {
                const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2, 8), mat.gold());
                post.position.set(9.5, i*0.35+1, -60+i*2); scene.add(post);
                const post2 = post.clone(); post2.position.x = -9.5; scene.add(post2);
            }
        }

        // --- RAMSES II STATUE (Grand Hall entrance) ---
        const sMat = mat.gold();
        const base = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), mat.column()); base.position.set(0, 1.5, 50); scene.add(base);
        const torso = new THREE.Mesh(new THREE.BoxGeometry(3.5, 8, 3), sMat); torso.position.set(0, 8, 50); scene.add(torso);
        const head = new THREE.Mesh(new THREE.SphereGeometry(1.8, 16, 16), sMat); head.position.set(0, 14, 50); scene.add(head);
        const crown = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 8), sMat); crown.position.set(0, 17, 50); scene.add(crown);
        // Statue spotlight
        const sLight = new THREE.SpotLight(0xd4af37, 2, 30, Math.PI/6, 0.5);
        sLight.position.set(0, 19, 50); sLight.target.position.set(0, 5, 50); scene.add(sLight); scene.add(sLight.target);

        // --- EGYPTIAN COLUMNS along corridors ---
        const colGeo = new THREE.CylinderGeometry(0.7, 1, 20, 12);
        const colMat = mat.column();
        const corridorCols = [];
        for (let z = -70; z <= 70; z += 14) { corridorCols.push([-25, z], [25, z]); }
        for (let x = -80; x <= 80; x += 20) { corridorCols.push([x, -25], [x, 25]); }
        corridorCols.forEach(([x, z]) => {
            const col = new THREE.Mesh(colGeo, colMat); col.position.set(x, 10, z); col.castShadow = true; scene.add(col);
            // Lotus capital
            const cap = new THREE.Mesh(new THREE.SphereGeometry(1.4, 8, 6, 0, Math.PI*2, 0, Math.PI/2), mat.gold());
            cap.position.set(x, 19.5, z); scene.add(cap);
            // Base
            const bs = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.5, 0.8, 12), colMat);
            bs.position.set(x, 0.4, z); scene.add(bs);
        });

        // --- HALL ROOMS (detailed) ---
        const hallColors = [0x00e5ff, 0xd4af37, 0xff6b35, 0x66bb6a, 0xab47bc, 0x29b6f6, 0xec407a, 0x26c6da, 0xffa726, 0x78909c];
        const hallLayouts = [
            { w: 22, d: 18, x: 0, z: 55 },    // Grand Hall
            { w: 16, d: 14, x: 0, z: 65 },     // Obelisk
            { w: 20, d: 16, x: 0, z: -15 },    // Staircase
            { w: 28, d: 22, x: -55, z: -45 },  // Tut Galleries
            { w: 28, d: 22, x: 55, z: -45 },   // Main Galleries
            { w: 18, d: 16, x: -70, z: 45 },   // Children
            { w: 22, d: 18, x: 55, z: -70 },   // Khufu
            { w: 20, d: 16, x: 70, z: 45 },    // Commercial
            { w: 18, d: 14, x: -85, z: -20 },  // Conservation
            { w: 22, d: 18, x: -55, z: -20 },  // Greco-Roman
        ];

        MAP_DATA.halls.forEach((hall, i) => {
            const lay = hallLayouts[i] || { w: 16, d: 14, x: i*20-50, z: 0 };
            const color = hallColors[i % hallColors.length];
            const hw = lay.w / 2, hd = lay.d / 2;
            const y = 0;

            // Room floor (distinct color)
            const roomFloor = new THREE.Mesh(
                new THREE.PlaneGeometry(lay.w, lay.d),
                new THREE.MeshStandardMaterial({ color: 0x1a1520, roughness: 0.15, metalness: 0.3 })
            );
            roomFloor.rotation.x = -Math.PI/2; roomFloor.position.set(lay.x, 0.02, lay.z); scene.add(roomFloor);

            // Glowing border
            const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(lay.w, 0.1, lay.d));
            const borderLine = new THREE.LineSegments(borderGeo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 }));
            borderLine.position.set(lay.x, 0.05, lay.z); scene.add(borderLine);

            // Room partition walls (half-height)
            const partMat = new THREE.MeshStandardMaterial({ color: 0x2a2535, roughness: 0.7, transparent: true, opacity: 0.85 });
            const pw = (w,d,x,z,ry=0) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w,6,d), partMat); m.position.set(x,3,z); m.rotation.y=ry; scene.add(m); };
            pw(lay.w, 0.3, lay.x, lay.z - hd); pw(lay.w, 0.3, lay.x, lay.z + hd);
            pw(0.3, lay.d, lay.x - hw, lay.z); pw(0.3, lay.d, lay.x + hw, lay.z);

            // Display cases (glass boxes with artifacts inside)
            const numCases = Math.min((hall.artifacts || []).length, 4);
            for (let c = 0; c < numCases; c++) {
                const cx = lay.x + (c - numCases/2 + 0.5) * (lay.w / (numCases + 1));
                const cz = lay.z;
                // Pedestal
                const ped = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 1.5), new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.3 }));
                ped.position.set(cx, 0.6, cz); ped.castShadow = true; scene.add(ped);
                // Artifact (gold object)
                const artGeo = c % 3 === 0 ? new THREE.ConeGeometry(0.4, 1.2, 6) : c % 3 === 1 ? new THREE.TorusGeometry(0.4, 0.15, 8, 16) : new THREE.OctahedronGeometry(0.5);
                const art = new THREE.Mesh(artGeo, mat.gold());
                art.position.set(cx, 1.8, cz); scene.add(art);
                // Glass case
                const glass = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2, 1.8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0, metalness: 0, transparent: true, opacity: 0.08, side: THREE.DoubleSide }));
                glass.position.set(cx, 2.2, cz); scene.add(glass);
                // Case light
                const cLight = new THREE.PointLight(color, 0.5, 5);
                cLight.position.set(cx, 3.5, cz); scene.add(cLight);
            }

            // Hall accent light
            const hLight = new THREE.PointLight(color, 0.8, lay.w);
            hLight.position.set(lay.x, 8, lay.z); scene.add(hLight);

            // Clickable invisible mesh
            const clickMesh = new THREE.Mesh(
                new THREE.BoxGeometry(lay.w, 8, lay.d),
                new THREE.MeshBasicMaterial({ visible: false })
            );
            clickMesh.position.set(lay.x, 4, lay.z);
            clickMesh.userData.hall = hall; scene.add(clickMesh); hallMeshes.push(clickMesh);

            // Floating label
            const cvs = document.createElement('canvas'); cvs.width = 512; cvs.height = 96;
            const ctx = cvs.getContext('2d');
            ctx.fillStyle = 'rgba(6,10,15,0.75)'; roundRect(ctx, 0, 0, 512, 96, 16); ctx.fill();
            ctx.strokeStyle = '#' + color.toString(16).padStart(6, '0'); ctx.lineWidth = 2; roundRect(ctx, 0, 0, 512, 96, 16); ctx.stroke();
            ctx.font = 'bold 28px Inter'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText(hall.name, 256, 42);
            ctx.font = '18px Inter'; ctx.fillStyle = '#' + color.toString(16).padStart(6, '0'); ctx.fillText(hall.level + ' • ' + (hall.time || ''), 256, 72);
            const tex = new THREE.CanvasTexture(cvs);
            const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
            spr.scale.set(14, 2.7, 1); spr.position.set(lay.x, 9, lay.z); scene.add(spr);
        });
    };

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
        ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h);
        ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath();
    }

    // === LIGHTING ===
    const addLighting = () => {
        const ambient = new THREE.AmbientLight(0x1a1a3e, 0.6);
        scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0xffecd2, 0x080820, 0.5);
        scene.add(hemi);

        const sun = new THREE.DirectionalLight(0xffecd2, 1.5);
        sun.position.set(50, 80, 40);
        sun.castShadow = true;
        sun.shadow.mapSize.set(2048, 2048);
        sun.shadow.camera.left = -100; sun.shadow.camera.right = 100;
        sun.shadow.camera.top = 80; sun.shadow.camera.bottom = -80;
        scene.add(sun);

        // Gold accent lights
        const goldLight1 = new THREE.PointLight(0xd4af37, 1.2, 60);
        goldLight1.position.set(0, 15, 50); scene.add(goldLight1);

        const goldLight2 = new THREE.PointLight(0xd4af37, 0.5, 30);
        goldLight2.position.set(-30, 10, -10); scene.add(goldLight2);

        // Cyan accent
        const cyanLight = new THREE.PointLight(0x00f2ff, 0.3, 50);
        cyanLight.position.set(20, 8, -20); scene.add(cyanLight);

        // Skylight beams
        for (let i = -40; i <= 40; i += 20) {
            const beam = new THREE.SpotLight(0xffffff, 0.3, 30, Math.PI / 8, 0.8);
            beam.position.set(i, 17, 0); beam.target.position.set(i, 0, 0);
            scene.add(beam); scene.add(beam.target);
        }
    };

    // === PARTICLES ===
    const addParticles = () => {
        const count = 500;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 100;
            pos[i + 1] = Math.random() * 18;
            pos[i + 2] = (Math.random() - 0.5) * 70;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        dustParticles = new THREE.Points(geo, new THREE.PointsMaterial({
            color: 0xd4af37, size: 0.08, transparent: true, opacity: 0.4
        }));
        scene.add(dustParticles);
    };

    // === ANIMATION ===
    const animate = () => {
        animId = requestAnimationFrame(animate);
        if (!isThreeReady) return;
        const t = clock.getElapsedTime();

        // Float particles
        if (dustParticles) {
            const pos = dustParticles.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
                pos[i] += Math.sin(t * 0.5 + i) * 0.002;
                if (pos[i] > 20) pos[i] = 0;
            }
            dustParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Gentle hall label float
        // (hall meshes are invisible click targets, no visual animation needed)

        if (viewMode === 'interior') renderer.render(scene, camera);
    };

    // === COMPLEX MAP (SVG) ===
    const renderComplex = () => {
        gemMap.innerHTML = '';
        const ext = createSvgGroup('EXT');

        // Roads
        [{ d: 'M 0 850 L 1000 850', w: 20 }, { d: 'M 550 0 L 550 850', w: 10 }, { d: 'M 780 0 Q 780 750 950 820', w: 30 }]
        .forEach(r => {
            const p = svgEl('path'); p.setAttribute('d', r.d); p.setAttribute('class', 'ext-road');
            p.setAttribute('stroke-width', r.w); ext.appendChild(p);
        });

        // Main Building
        const bldg = svgEl('path');
        bldg.setAttribute('d', 'M 280 500 L 320 600 L 680 750 L 580 450 L 380 320 L 300 350 L 350 450 Z');
        bldg.setAttribute('class', 'ext-building-main');
        bldg.onclick = () => openHall(MAP_DATA.complex[0]);
        ext.appendChild(bldg);
        addSvgText(ext, 480, 580, 'Main\nBuilding');

        // Gardens
        [{ d: 'M 240 550 L 310 600 L 260 760 L 200 700 Z', n: 'Sculpture\nGarden', x: 260, y: 680 },
         { d: 'M 390 280 L 520 230 L 560 360 L 440 420 Z', n: 'Terraced\nGardens', x: 480, y: 310 },
         { d: 'M 680 750 L 880 780 L 830 850 L 630 830 Z', n: 'Palm\nGarden', x: 750, y: 780 }]
        .forEach(g => {
            const p = svgEl('path'); p.setAttribute('d', g.d); p.setAttribute('class', 'ext-garden');
            ext.appendChild(p); addSvgText(ext, g.x, g.y, g.n);
        });

        // Landmarks
        [{ d: 'M 280 720 L 410 820 L 450 720 L 320 650 Z', c: '#455a64', n: '1', x: 400, y: 750 },
         { d: 'M 650 350 L 750 380 L 730 450 L 630 420 Z', c: '#78909c', n: '3', x: 680, y: 400 },
         { d: 'M 320 350 L 380 400 L 350 450 L 280 400 Z', c: '#90a4ae', n: '4', x: 350, y: 420 },
         { d: 'M 450 100 L 600 120 L 580 200 L 430 180 Z', c: '#b0bec5', n: '5', x: 500, y: 150 }]
        .forEach(l => {
            const p = svgEl('path'); p.setAttribute('d', l.d); p.style.fill = l.c; p.style.stroke = '#fff';
            ext.appendChild(p);
            const t = svgEl('text'); t.setAttribute('x', l.x); t.setAttribute('y', l.y);
            t.setAttribute('class', 'ext-number'); t.textContent = l.n; ext.appendChild(t);
        });

        // P icons
        [{x:150,y:800},{x:700,y:300},{x:720,y:330},{x:740,y:360},{x:780,y:550}].forEach(ic => {
            const g = svgEl('g');
            const r = svgEl('rect'); r.setAttribute('x', ic.x-12); r.setAttribute('y', ic.y-12);
            r.setAttribute('width', 24); r.setAttribute('height', 24); r.setAttribute('fill', '#333'); g.appendChild(r);
            const t = svgEl('text'); t.setAttribute('x', ic.x); t.setAttribute('y', ic.y+4);
            t.setAttribute('text-anchor', 'middle'); t.setAttribute('fill', '#fff');
            t.setAttribute('style', 'font-weight:900;font-size:12px;'); t.textContent = 'P'; g.appendChild(t);
            ext.appendChild(g);
        });

        // T icon
        const tg = svgEl('g');
        const tc = svgEl('circle'); tc.setAttribute('cx', 260); tc.setAttribute('cy', 780);
        tc.setAttribute('r', 12); tc.setAttribute('fill', '#0288d1'); tg.appendChild(tc);
        const tt = svgEl('text'); tt.setAttribute('x', 260); tt.setAttribute('y', 784);
        tt.setAttribute('text-anchor', 'middle'); tt.setAttribute('fill', '#fff');
        tt.setAttribute('style', 'font-weight:900;font-size:12px;'); tt.textContent = 'T'; tg.appendChild(tt);
        ext.appendChild(tg);

        // Clickable areas
        MAP_DATA.complex.forEach(item => {
            const c = svgEl('circle'); c.setAttribute('cx', item.coordinates.x); c.setAttribute('cy', item.coordinates.y);
            c.setAttribute('r', 35); c.setAttribute('fill', 'transparent'); c.style.cursor = 'pointer';
            c.onclick = e => { e.stopPropagation(); openHall(item); }; ext.appendChild(c);
        });
    };

    const svgEl = tag => document.createElementNS('http://www.w3.org/2000/svg', tag);
    const createSvgGroup = id => { const g = svgEl('g'); g.id = id; gemMap.appendChild(g); return g; };
    const addSvgText = (layer, x, y, text) => {
        const t = svgEl('text'); t.setAttribute('x', x); t.setAttribute('y', y); t.setAttribute('class', 'ext-label');
        text.split('\n').forEach((line, i) => {
            const ts = svgEl('tspan'); ts.setAttribute('x', x); ts.setAttribute('dy', i === 0 ? 0 : '1.2em');
            ts.textContent = line; t.appendChild(ts);
        });
        layer.appendChild(t);
    };

    // === VIEW SWITCHING ===
    const switchView = mode => {
        viewMode = mode;
        viewTabs.forEach(t => t.classList.toggle('active', t.dataset.view === mode));
        if (mode === 'complex') {
            complexMap.classList.remove('hidden');
            container.style.display = 'none';
            floorSwitcher.classList.add('hidden');
            document.getElementById('miniMap').classList.add('hidden');
            legendItems.classList.add('hidden');
            complexLegend.classList.remove('hidden');
            document.getElementById('legendTitle').textContent = 'MUSEUM COMPLEX';
        } else {
            complexMap.classList.add('hidden');
            container.style.display = 'block';
            floorSwitcher.classList.remove('hidden');
            document.getElementById('miniMap').classList.remove('hidden');
            legendItems.classList.remove('hidden');
            complexLegend.classList.add('hidden');
            document.getElementById('legendTitle').textContent = 'FLOOR ' + currentLevel;
        }
        updateLegend();
    };

    // === OPEN HALL ===
    const openHall = hall => {
        document.getElementById('popupName').textContent = hall.name;
        document.getElementById('popupDesc').textContent = hall.description || 'Exhibition area within the Grand Egyptian Museum.';
        document.getElementById('popupLevel').textContent = hall.level ? 'LEVEL ' + hall.level : 'EXTERIOR';
        document.getElementById('popupTime').textContent = hall.time || '20 MINS';
        document.getElementById('popupImage').src = hall.image || '../hall.jpg';
        const artDiv = document.getElementById('popupArtifacts');
        artDiv.innerHTML = '';
        (hall.artifacts || []).forEach(a => {
            const tag = document.createElement('span'); tag.className = 'artifact-tag'; tag.textContent = a;
            artDiv.appendChild(tag);
        });
        hallPopup.classList.remove('hidden');
    };

    // === LEGEND ===
    const updateLegend = () => {
        legendItems.innerHTML = '';
        if (viewMode === 'complex') return;
        const items = MAP_DATA.halls.filter(h => h.level === currentLevel);
        items.forEach(item => {
            const div = document.createElement('div'); div.className = 'legend-item';
            div.innerHTML = `<span class="icon">𓉐</span><span>${item.name}</span>`;
            div.onclick = () => openHall(item);
            legendItems.appendChild(div);
        });
    };

    // === SEARCH ===
    const setupSearch = () => {
        const panel = document.getElementById('searchPanel');
        const input = document.getElementById('searchInput');
        const results = document.getElementById('searchResults');
        document.getElementById('searchToggle').onclick = () => { panel.classList.toggle('hidden'); input.focus(); };
        input.oninput = () => {
            const q = input.value.toLowerCase();
            results.innerHTML = '';
            if (q.length < 2) return;
            const all = [...MAP_DATA.halls, ...MAP_DATA.complex];
            all.filter(h => h.name.toLowerCase().includes(q) || (h.description || '').toLowerCase().includes(q))
               .slice(0, 8).forEach(h => {
                const d = document.createElement('div'); d.className = 'search-result-item';
                d.innerHTML = `<div><div class="sr-name">${h.name}</div><div class="sr-level">${h.level || 'Exterior'}</div></div>`;
                d.onclick = () => { openHall(h); panel.classList.add('hidden'); input.value = ''; };
                results.appendChild(d);
            });
        };
    };

    // === EVENTS ===
    const setupEvents = () => {
        viewTabs.forEach(t => t.onclick = () => switchView(t.dataset.view));
        levelBtns.forEach(b => b.onclick = () => {
            currentLevel = b.dataset.level;
            levelBtns.forEach(x => x.classList.toggle('active', x.dataset.level === currentLevel));
            document.getElementById('legendTitle').textContent = 'FLOOR ' + currentLevel;
            updateLegend();
        });

        document.querySelector('.popup-close').onclick = () => hallPopup.classList.add('hidden');

        // Camera presets
        document.getElementById('camReset').onclick = () => {
            camera.position.set(0, 80, 120); camera.lookAt(0, 0, 0);
        };
        document.getElementById('camTopView').onclick = () => {
            camera.position.set(0, 150, 0.1); camera.lookAt(0, 0, 0);
        };
        document.getElementById('camFirstPerson').onclick = () => {
            camera.position.set(0, 4, 70); camera.lookAt(0, 5, 0);
        };
        document.getElementById('camOrbit').onclick = () => {
            camera.position.set(50, 30, 50); camera.lookAt(0, 5, 0);
        };

        // Tour
        document.getElementById('tourBtn').onclick = async () => {
            const halls = viewMode === 'complex' ? MAP_DATA.complex : MAP_DATA.halls.filter(h => h.level === currentLevel);
            for (const h of halls) { openHall(h); await new Promise(r => setTimeout(r, 3500)); }
            hallPopup.classList.add('hidden');
        };

        setupSearch();

        // Mini-map
        const miniCtx = document.getElementById('miniMapCanvas')?.getContext('2d');
        if (miniCtx) {
            miniCtx.fillStyle = '#0a1520'; miniCtx.fillRect(0, 0, 200, 150);
            miniCtx.strokeStyle = '#d4af3744'; miniCtx.lineWidth = 1;
            miniCtx.strokeRect(30, 20, 140, 110);
            miniCtx.fillStyle = '#d4af37'; miniCtx.font = 'bold 8px Inter';
            miniCtx.fillText('GEM FLOOR PLAN', 60, 80);
        }
    };

    init();
});
