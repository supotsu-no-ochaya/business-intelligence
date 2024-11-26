import React from 'react';import './Dashboard.css';  // Import der CSS-Datei


const MyDashboard = () => {
  return (
    <div style={{width: '100%', height: '100%', position: 'relative', background: '#171825'}}>
    <div style={{width: 1080, height: 627, left: 143, top: 70, position: 'absolute', background: '#1D1E2C', borderRadius: 20}} />
    <div style={{width: 887, height: 68, left: 336, top: 70, position: 'absolute', background: '#24263A', borderTopLeftRadius: 20, borderTopRightRadius: 10}} />
    <div style={{left: 353, top: 95, position: 'absolute', color: '#DBDFEA', fontSize: 14, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Hello, World!</div>
    <div style={{width: 180, height: 627, left: 143, top: 70, position: 'absolute'}}>
        <div style={{width: 180, height: 627, left: 0, top: 0, position: 'absolute', background: '#24263A', borderTopLeftRadius: 20, borderTopRightRadius: 20}} />
        <div style={{width: 138.46, height: 0, left: 27.70, top: 67.31, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{width: 138.46, height: 0, left: 27.70, top: 293.46, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{width: 138.46, height: 0, left: 27.70, top: 367.31, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{left: 33.46, top: 27.93, position: 'absolute', color: '#DBDFEA', fontSize: 15, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Your Logo</div>
        <div style={{width: 163, height: 25, left: 17, top: 79, position: 'absolute'}}>
            <div style={{width: 163, height: 25, left: 0, top: 0, position: 'absolute', background: '#1D1E2C', borderTopLeftRadius: 100, borderTopRightRadius: 100}} />
            <div style={{width: 60, height: 13.85, left: 47.61, top: 5.62, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Dashboard</div>
            <div style={{width: 13.85, height: 13.85, left: 18.70, top: 5.62, position: 'absolute'}}>
                <div style={{width: 11.08, height: 11.06, left: 1.15, top: 1.63, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 5.77, height: 5.77, left: 6.92, top: 1.15, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 104.24, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 63.46, height: 13.85, left: 64.61, top: 5.77, position: 'absolute', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
                <div style={{width: 63.46, height: 13.85, color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Verbrauch</div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 129.61, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 53.08, left: 64.61, top: 5.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Zutaten</div>
            <div style={{width: 14, height: 14, left: 36, top: 5.39, position: 'absolute'}}>
                <div style={{width: 13, height: 11, left: 0.50, top: 1.50, position: 'absolute'}}>
                    <div style={{width: 10, height: 11, left: 0, top: 0, position: 'absolute', border: '1px white solid'}}></div>
                    <div style={{width: 9, height: 11, left: 4, top: 0, position: 'absolute', border: '1px white solid'}}></div>
                    <div style={{width: 3, height: 0, left: 9, top: 4.50, position: 'absolute', border: '1px white solid'}}></div>
                </div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 155, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 66.92, height: 13.85, left: 64.61, top: 5.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Getränke</div>
            <div style={{width: 14, height: 14, left: 36, top: 6, position: 'absolute'}}>
                <div style={{height: 13, left: 1.50, top: 0.50, position: 'absolute'}}>
                    <div style={{width: 11, height: 4, left: 0, top: 2.50, position: 'absolute', border: '1px white solid'}}></div>
                    <div style={{width: 9, height: 2.50, left: 1, top: 0, position: 'absolute', border: '1px white solid'}}></div>
                    <div style={{width: 9, height: 6.50, left: 1, top: 6.50, position: 'absolute', border: '1px white solid'}}></div>
                </div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 305.01, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 43.85, height: 13.85, left: 64.61, top: 5.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Settings</div>
            <div style={{width: 13.85, height: 13.85, left: 35.70, top: 5.77, position: 'absolute'}}>
                <div style={{width: 10.40, height: 11.54, left: 1.72, top: 1.15, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 3.46, height: 3.46, left: 5.19, top: 5.19, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 378.84, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 40.38, height: 13.85, left: 64.61, top: 5.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Log out</div>
            <div style={{width: 13.85, height: 13.85, left: 35.70, top: 5.77, position: 'absolute'}}>
                <div style={{width: 3.46, height: 10.38, left: 1.73, top: 1.73, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.88, height: 5.77, left: 9.23, top: 4.04, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 6.92, height: 0, left: 5.19, top: 6.92, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 161.54, height: 25.38, left: 0, top: 330.39, position: 'absolute'}}>
            <div style={{width: 161.54, height: 25.38, left: 0, top: 0, position: 'absolute'}} />
            <div style={{width: 43.85, height: 13.85, left: 64.61, top: 5.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Support</div>
            <div style={{width: 13.85, height: 13.85, left: 35.70, top: 5.77, position: 'absolute'}}>
                <div style={{width: 11.54, height: 11.54, left: 1.15, top: 1.15, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 4.62, height: 4.62, left: 4.62, top: 4.62, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.45, height: 2.45, left: 2.84, top: 2.84, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.45, height: 2.45, left: 8.56, top: 8.56, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.45, height: 2.45, left: 8.56, top: 2.84, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.04, height: 2.04, left: 8.56, top: 3.25, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
                <div style={{width: 2.45, height: 2.45, left: 2.84, top: 8.56, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 66.92, height: 13.85, left: 64.61, top: 191.77, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Verkaufszahlen</div>
        <div style={{width: 14, height: 14, left: 36, top: 194, position: 'absolute'}}>
            <div style={{width: 13, height: 7, left: 0.50, top: 3.50, position: 'absolute'}}>
                <div style={{width: 4, height: 4, left: 9, top: 0, position: 'absolute', border: '1px #DBDFEA solid'}}></div>
                <div style={{width: 13, height: 7, left: 0, top: 0, position: 'absolute', border: '1px #DBDFEA solid'}}></div>
            </div>
        </div>
    </div>
    <div style={{width: 14, height: 14, left: 179, top: 179, position: 'absolute'}}>
        <div style={{width: 12, height: 13, left: 1, top: 0.50, position: 'absolute'}}>
            <div style={{width: 4.50, height: 13, left: 7.50, top: 0, position: 'absolute', border: '1px white solid'}}></div>
            <div style={{width: 0, height: 13, left: 2.50, top: 0, position: 'absolute', border: '1px white solid'}}></div>
            <div style={{width: 5, height: 5, left: 0, top: 0, position: 'absolute', border: '1px white solid'}}></div>
        </div>
    </div>
    <div style={{width: 18, height: 18, left: 1180, top: 95, position: 'absolute'}}>
        <div style={{width: 9, height: 4.50, left: 4.50, top: 6.75, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
    </div>
    <div style={{left: 1136, top: 99, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Darsh A...</div>
    <div style={{width: 18, height: 18, left: 1045, top: 95, position: 'absolute'}}>
        <div style={{width: 12, height: 12, left: 2.25, top: 2.25, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 3.26, height: 3.26, left: 12.49, top: 12.49, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
    </div>
    <div style={{width: 18, height: 18, left: 1073, top: 95, position: 'absolute'}}>
        <div style={{width: 13.50, height: 11.25, left: 2.25, top: 1.50, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 2.59, height: 0.75, left: 7.70, top: 15.75, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 5, height: 5, left: 10, top: 5, position: 'absolute', transform: 'rotate(-90deg)', transformOrigin: '0 0', background: 'linear-gradient(90deg, #DC2430 0%, #7B4397 100%)', borderRadius: 9999}} />
    </div>
    <img style={{width: 25, height: 25, left: 1101, top: 92, position: 'absolute', borderRadius: 9999}} src="https://via.placeholder.com/25x25" />
    <div style={{width: 248, height: 391, left: 336, top: 162, position: 'absolute'}}>
        <div style={{width: 248, height: 391, left: 0, top: 391, position: 'absolute', background: '#24263A', borderRadius: 10}} />
        <div style={{width: 84.43, height: 22.03, left: 147.74, top: 16.53, position: 'absolute'}}>
            <div style={{width: 84.43, height: 22.03, left: 0, top: 0, position: 'absolute', background: '#1D1E2C', borderRadius: 20}} />
            <div style={{width: 37.99, height: 8.81, left: 10.55, top: 6.61, position: 'absolute', color: '#DBDFEA', fontSize: 7, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Last Month</div>
            <div style={{width: 12.66, height: 13.22, left: 61.21, top: 4.41, position: 'absolute'}}>
                <div style={{width: 6.33, height: 3.30, left: 3.17, top: 4.96, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 216.34, height: 0, left: 15.83, top: 350.25, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{width: 64.37, height: 17.62, left: 15.83, top: 17.63, position: 'absolute', color: '#DBDFEA', fontSize: 14, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Analytics</div>
        <div style={{width: 216.34, height: 278.29, left: 15.83, top: 55.07, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'inline-flex'}}>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 64, left: 169, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Stairs</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 65, left: 170, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Footings</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 59, left: 164, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Electrical</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 55, left: 160, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing Material </div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 58, left: 163, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Finish Labor</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 48, left: 153, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Hardware</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 32, left: 137, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Tile Installation</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Roofing </div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 13, left: 118, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Appliances Install</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 115, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Insulation </div>
            </div>
            <div style={{width: 204, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 204, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 114, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Interior Painting</div>
            </div>
        </div>
        <div style={{width: 24.27, height: 13.29, left: 15.83, top: 364.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Total</div>
        <div style={{width: 33.77, height: 13.29, left: 198.40, top: 364.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>$17,355</div>
    </div>
    <div style={{width: 248.17, height: 391, left: 643, top: 159, position: 'absolute'}}>
        <div style={{width: 248, height: 391, left: 0, top: 391, position: 'absolute', background: '#24263A', borderRadius: 10}} />
        <div style={{width: 84.43, height: 22.03, left: 147, top: 17, position: 'absolute'}}>
            <div style={{width: 84.43, height: 22.03, left: 0, top: 0, position: 'absolute', background: '#1D1E2C', borderRadius: 20}} />
            <div style={{width: 37.99, height: 8.81, left: 10.55, top: 6.61, position: 'absolute', color: '#DBDFEA', fontSize: 7, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Last Month</div>
            <div style={{width: 12.66, height: 13.22, left: 61.21, top: 4.41, position: 'absolute'}}>
                <div style={{width: 6.33, height: 3.30, left: 3.17, top: 4.96, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 216.34, height: 0, left: 31.83, top: 351.25, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{width: 64.37, height: 17.62, left: 31.83, top: 18.63, position: 'absolute', color: '#DBDFEA', fontSize: 14, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Analytics</div>
        <div style={{width: 216.34, height: 278.29, left: 31.83, top: 56.07, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'inline-flex'}}>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 64, left: 169, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Stairs</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 65, left: 170, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Footings</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 59, left: 164, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Electrical</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 55, left: 160, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing Material </div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 58, left: 163, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Finish Labor</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 48, left: 153, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Hardware</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 32, left: 137, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Tile Installation</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Roofing </div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 13, left: 118, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Appliances Install</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 115, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Insulation </div>
            </div>
            <div style={{width: 204, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 204, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 114, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Interior Painting</div>
            </div>
        </div>
        <div style={{width: 24.27, height: 13.29, left: 31.83, top: 365.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Total</div>
        <div style={{width: 33.77, height: 13.29, left: 214.40, top: 365.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>$17,355</div>
    </div>
    <div style={{width: 248, height: 391, left: 950, top: 159, position: 'absolute'}}>
        <div style={{width: 248, height: 391, left: 0, top: 391, position: 'absolute', background: '#24263A', borderRadius: 10}} />
        <div style={{width: 84.43, height: 22.03, left: 147.74, top: 16.53, position: 'absolute'}}>
            <div style={{width: 84.43, height: 22.03, left: 0, top: 0, position: 'absolute', background: '#1D1E2C', borderRadius: 20}} />
            <div style={{width: 37.99, height: 8.81, left: 10.55, top: 6.61, position: 'absolute', color: '#DBDFEA', fontSize: 7, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Last Month</div>
            <div style={{width: 12.66, height: 13.22, left: 61.21, top: 4.41, position: 'absolute'}}>
                <div style={{width: 6.33, height: 3.30, left: 3.17, top: 4.96, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
            </div>
        </div>
        <div style={{width: 216.34, height: 0, left: 15.83, top: 350.25, position: 'absolute', border: '1px #1D1E2C solid'}}></div>
        <div style={{width: 64.37, height: 17.62, left: 15.83, top: 17.63, position: 'absolute', color: '#DBDFEA', fontSize: 14, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Analytics</div>
        <div style={{width: 216.34, height: 278.29, left: 15.83, top: 55.07, position: 'absolute', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: 12, display: 'inline-flex'}}>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 64, left: 169, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Stairs</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 65, left: 170, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Footings</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 59, left: 164, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Electrical</div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 55, left: 160, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing Material </div>
            </div>
            <div style={{width: 205, height: 11.17, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1.17, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 58, left: 163, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Finish Labor</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 48, left: 153, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Hardware</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 32, left: 137, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Framing</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Tile Installation</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 25, left: 130, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Roofing </div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 13, left: 118, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Appliances Install</div>
            </div>
            <div style={{width: 205, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 205, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 115, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Insulation </div>
            </div>
            <div style={{width: 204, height: 11, position: 'relative'}}>
                <div style={{width: 10, height: 100, left: 204, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: '#1D1E2C', borderRadius: 100}} />
                <div style={{width: 10, height: 10, left: 114, top: 1, position: 'absolute', transform: 'rotate(90deg)', transformOrigin: '0 0', background: 'linear-gradient(360deg, #DC2430 0%, #DB2379 51%, #7B4397 100%)', borderRadius: 100}} />
                <div style={{left: 0, top: 0, position: 'absolute', color: '#DBDFEA', fontSize: 8, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Interior Painting</div>
            </div>
        </div>
        <div style={{width: 24.27, height: 13.29, left: 15.83, top: 364.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>Total</div>
        <div style={{width: 33.77, height: 13.29, left: 198.40, top: 364.42, position: 'absolute', color: '#DBDFEA', fontSize: 10, fontFamily: 'Alatsi', fontWeight: '400', wordWrap: 'break-word'}}>$17,355</div>
    </div>
    <div style={{width: 18, height: 18, left: 1017, top: 95, position: 'absolute'}}>
        <div style={{width: 6, height: 6, left: 6, top: 6, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 0, height: 1.50, left: 9, top: 1.50, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 0, height: 1.50, left: 9, top: 15, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.12, height: 1.12, left: 3.75, top: 3.75, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.12, height: 1.12, left: 13.12, top: 13.12, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.50, height: 0, left: 1.50, top: 9, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.50, height: 0, left: 15, top: 9, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.12, height: 1.12, left: 3.75, top: 13.12, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
        <div style={{width: 1.12, height: 1.12, left: 13.12, top: 3.75, position: 'absolute', border: '0.80px #DBDFEA solid'}}></div>
    </div>
</div>
  );
};

export default MyDashboard;