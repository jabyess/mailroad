import React from 'react'
import EmailTable from '../jsx/emails/EmailTable.jsx'
import renderer from 'react-test-renderer'

const emails = [
  {id: 1},
  {id: 2},
  {id: 3},
  {id: 4}
]

const noop = () => {}
const selected = {}

// Test: does an email table get created properly?
it('Creates a table of n emails', () => {
	const component = renderer.create(
    <EmailTable
      emailItems={emails}
      selectedCheckboxes={selected}
      updateSelectedCheckboxes={noop}
    >
    </EmailTable>
  )

	const tree = component.toJSON()
	const selectors = tree.children

	expect(selectors[0].type).toBe('thead')
	expect(selectors[1].type).toBe('tbody')

	const trows = selectors[1].children
	expect(trows.length).toBe(emails.length)

	const first_row = trows[0]
	expect(first_row.type).toBe('tr')

  expect(tree).toMatchSnapshot()
})
