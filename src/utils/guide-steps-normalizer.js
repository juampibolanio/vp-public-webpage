const CATEGORY_LABEL_MAP = {
    'PROVISIONAL': 'Previsionales',
    'SOCIAL': 'Sociales',
    'DOCUMENTATION': 'Documentación',
    'HEALTH': 'Salud',
    'TRANSIT': 'Tránsito'
};

function extractTextFromBlocks(content) {
    if (!content) return '';
    if (typeof content === 'string') return content;
    
    if (Array.isArray(content)) {
        return content.map(block => {
            if (block.children && Array.isArray(block.children)) {
                return block.children.map(child => child.text).join('');
            }
            return '';
        }).join('\n');
    }
    return '';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-AR', { month: 'short', year: 'numeric' }).format(date);
}

export function normalizeGuideDetail(rawGuide) {
    if (!rawGuide) return null;

    const attr = rawGuide.attributes || rawGuide;
    const rawReqs = attr.guide_requeriments?.data || attr.guide_requeriments || [];
    const requirements = rawReqs
        .sort((a, b) => (a.attributes?.display_order || 0) - (b.attributes?.display_order || 0))
        .map(r => (r.attributes || r).description);
    const rawSteps = attr.guide_steps?.data || attr.guide_steps || [];
    const steps = rawSteps
        .map(s => {
            const sAttr = s.attributes || s;
            return {
                number: sAttr.step_number,
                title: sAttr.title,
                desc: extractTextFromBlocks(sAttr.description) 
            };
        })
        .sort((a, b) => a.number - b.number);

    const rawTips = attr.guide_tips || [];
    const tips = rawTips.map(t => t.description);
    const info = {
        organization: attr.organization || 'Organismo Oficial',
        province: attr.province ? (attr.province === 'CHACO' ? 'Chaco' : 'Corrientes') : 'Regional',
        time: attr.processing_time || 'A confirmar',
        delivery: 'Tiempo estimado', 
        modality: attr.modality_info || 'Presencial', 
        appointment: attr.appointment_info || 'Requiere Turno',
        cost: attr.cost || 'Gratuito'
    };

    const contact = {
        phone: attr.contact_phone || "No especificado",
        hours: attr.contact_hours || "Horario a confirmar",
        website: attr.contact_website || "#",
        address: attr.contact_address || "Dirección a confirmar"
    };

    return {
        title: attr.title,
        description: attr.description,
        updatedAt: formatDate(attr.lastUpdated || attr.updatedAt),
        category: CATEGORY_LABEL_MAP[attr.category] || 'Trámite',
        info,
        requirements,
        steps,
        contact,
        tips
    };
}