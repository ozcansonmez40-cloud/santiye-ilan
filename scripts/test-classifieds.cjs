const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { CATEGORIES, TYPE_LABELS, categoryForType, matchesListingFilters } = require('../.test-build/classifieds.js')
const { emptyDraft, validateDraft, createListingPayload, slugify } = require('../.test-build/listing-draft.js')

const rules = fs.readFileSync(path.join(__dirname, '../firestore.rules'), 'utf8')
const allowedKeys = [...rules.match(/keys\(\)\.hasOnly\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map(match => match[1])
const fixtures = []

assert.equal(CATEGORIES.length, 5)
assert.equal(new Set(CATEGORIES.flatMap(category => category.types)).size, 9)
for (const category of CATEGORIES) {
  for (const type of category.types) {
    const draft = { ...emptyDraft(category.id), listingType: type, title: '  İstanbul ilanı  ', city: 'İstanbul', detail: category.id === 'is' ? 'Yazılım Geliştirici' : category.suggestions[0], description: 'Açıklama', priceText: '15.000 TL / ay', contactName: 'İlan Sahibi', contactEmail: 'ornek@example.com', contactPhone: '05000000000', companyName: 'İşletme', workType: 'full_time' }
    assert.deepEqual(validateDraft(draft), {})
    const payload = createListingPayload(draft, 'test-user', 'istanbul-ilani')
    assert.equal(payload.title, 'İstanbul ilanı')
    assert.equal(payload.salaryText, '15.000 TL / ay')
    assert.equal(categoryForType(payload.listingType).id, category.id)
    assert.equal(payload.position, draft.detail)
    assert.equal(payload.status, 'active')
    assert.equal(payload.isFeatured, false)
    assert.equal(payload.workType, category.id === 'is' ? 'full_time' : undefined)
    assert.equal(payload.companyName, type === 'worker' ? undefined : 'İşletme')
    for (const key of Object.keys(payload)) assert.ok(allowedKeys.includes(key), `Unexpected Firestore field ${key}`)
    for (const key of ['category', 'contactName', 'contactPhone', 'contactEmail', 'whatsappEnabled']) assert.equal(key in payload, false)
    const listing = { ...payload, id: type, createdAt: '2026-11-15T00:00:00Z', updatedAt: '2026-11-15T00:00:00Z' }
    assert.ok(matchesListingFilters(listing, { category: category.id, type, city: 'İstanbul', position: draft.detail, q: 'İSTANBUL' }))
    assert.ok(!matchesListingFilters(listing, { city: 'Ankara' }))
    fixtures.push(listing)
    assert.ok(TYPE_LABELS[type])
  }
}
for (const category of CATEGORIES) assert.equal(fixtures.filter(item => matchesListingFilters(item, { category: category.id })).length, category.types.length)
assert.equal(categoryForType('employer').id, 'is')
assert.equal(categoryForType('worker').id, 'is')
assert.ok(!matchesListingFilters(fixtures.find(item => item.listingType === 'employer'), { category: 'emlak' }))
assert.equal(slugify('İstanbul Şişli Çalışma Masası'), 'istanbul-sisli-calisma-masasi')
assert.ok(Object.keys(validateDraft(emptyDraft())).length > 0)
const valid = { ...emptyDraft('urun'), title: 'Masa', city: 'İstanbul', detail: 'Mobilya', description: 'Açıklama', contactName: 'İlan Sahibi', contactPhone: '05000000000' }
assert.ok(validateDraft({ ...valid, category: 'emlak' }).listingType)
assert.ok(validateDraft({ ...valid, detail: '   ' }).detail)
assert.ok(validateDraft({ ...valid, contactPhone: '', contactEmail: '' }).contactPhone)
assert.throws(() => createListingPayload(emptyDraft(), 'uid', 'slug'))
const icon = fs.readFileSync(path.join(__dirname, '../app/favicon.ico'))
assert.equal(icon.readUInt16LE(0), 0)
assert.equal(icon.readUInt16LE(2), 1)
assert.equal(icon.readUInt16LE(4), 6)
for (let index = 0; index < 6; index++) {
  const entry = 6 + index * 16
  const offset = icon.readUInt32LE(entry + 12)
  assert.equal(icon.subarray(offset, offset + 8).toString('hex'), '89504e470d0a1a0a')
}
console.log('PASS: 5 categories, 9 listing types, legacy jobs, filtering, validation, private contact separation, deployed field compatibility, Turkish slugs and ICO frames.')
