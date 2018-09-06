const regions = {
    bdy: 'bandung',
    blr: 'bengaluru',
    brw: 'broward',
    chn: 'chennai',
    jbd: 'jakarta',
    mdh: 'madhubani',
    mum: 'mumbai',
    krl: 'kerala',
    sby: 'surabaya',
    srg: 'semarang',
};

export default (instanceRegionCode) => {
    if (instanceRegionCode in regions) {
        return regions[instanceRegionCode];
    } else {
        return null;
    }
};
