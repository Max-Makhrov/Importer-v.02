# Importer-v.02
Imports data between files with conditions.

Set connections between sheets. The script will do the rest.
<h3><strong>Targets</strong></h3>
Fill targets on sheet \<span style="text-decoration: underline;">Targets</span>/.

Targets are tables where to paste the info:

<img class="alignnone size-full wp-image-1401" src="https://sheetswithmaxmakhrov.files.wordpress.com/2018/04/target_dample1.png" alt="target_dample1" width="632" height="109" /> 
↑ Each row represents 1 target on sheet \<span style="text-decoration: underline;">Targets</span>/
<p></p>

<p>The script needs to know some basic info about your tables. Fill in the info about your targets: file ids, sheet names, and first rows where to paste the info. Give a unique id to each of your targets.</p>

Add SQL text to a column called "Query Target". The simplest query is:

<code>SELECT * FROM ?</code>

It will select all records from the table.

Set "Cleat old data" to 1 if you want to clear the previous data from the target sheet.
<h3><strong>Sources</strong></h3>
Fill sources on sheet \<span style="text-decoration: underline;">Sources</span>/.

Link each source with its target by "Task Id":

<img class="alignnone size-full wp-image-1402" src="https://sheetswithmaxmakhrov.files.wordpress.com/2018/04/source_dample1.png" alt="source_dample1" width="493" height="107" /> 
↑ Each row represents 1 connection "Source→Target".

<img class="alignnone size-full wp-image-1403" src="https://sheetswithmaxmakhrov.files.wordpress.com/2018/04/source_dample2.png" alt="source_dample2" width="580" height="146" /> 
↑ Connections are made by unique Task Ids. One target may contain multiple sources.

Fill in the coordinates: File Id, Sheet name and First row with data. Fill "Query Source" with a proper SQL request.

 
<h3><strong>First launch</strong></h3>
After you finish with settings:
<ol>
	<li>Launch import: [<code>Admin</code>] > [<code>Make import now</code>]. Do it any time you need to refresh your data.</li>
	<li>Run import hourly: [<code>Admin</code>] > [<code>Install</code>] > [<code>Set 1 Hour Trigger</code>].  Do it once and the trigger will run constantly.</li>
</ol>
If you want to add more connections, set them in new lines, and the Importer will adjust new settings automatically.
<h3><strong>What the Importer will  do</strong></h3>
The Importer works in 3 steps: Sources → Target → Import.

Step 1, Sources.  See the source table => modify it with SQL. "Query source" is applied in the first step.

Step 2, Target. Combine one or more source tables into one target => use SQL to combine multiple sources.  "Query target" from sheet \<span style="text-decoration: underline;">Tatget</span>/ is applied in the second step.

Step 3, Import. Delete existing data if needed => paste the new data.  Note: the data is deleted from the columns of import only.
